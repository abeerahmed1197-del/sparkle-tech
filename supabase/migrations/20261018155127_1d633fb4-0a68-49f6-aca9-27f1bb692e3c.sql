CREATE TABLE public.product_drafts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid REFERENCES public.products(id) ON DELETE CASCADE, title text NOT NULL DEFAULT '', payload jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_drafts TO authenticated;
GRANT ALL ON public.product_drafts TO service_role;
ALTER TABLE public.product_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage product drafts" ON public.product_drafts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER product_drafts_touch BEFORE UPDATE ON public.product_drafts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.is_active));
DROP POLICY IF EXISTS "Anyone can view variants" ON public.product_variants;
CREATE POLICY "Anyone can view variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.is_active));
DROP POLICY IF EXISTS "Anyone can view variant images" ON public.product_variant_images;
CREATE POLICY "Anyone can view variant images" ON public.product_variant_images FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.product_variants v JOIN public.products p ON p.id = v.product_id WHERE v.id = variant_id AND p.is_active));
CREATE OR REPLACE FUNCTION public.publish_product_draft(_draft_id uuid) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE d public.product_drafts; f jsonb; v jsonb; image jsonb; pid uuid; vid uuid; kept uuid[] := '{}'; pos integer;
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Admin access required'; END IF;
 SELECT * INTO d FROM public.product_drafts WHERE id = _draft_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Draft not found'; END IF;
 f := d.payload->'form';
 IF COALESCE(trim(f->>'name'),'') = '' OR (f->>'price')::numeric < 0 THEN RAISE EXCEPTION 'Valid name and price required'; END IF;
 pid := COALESCE(d.product_id, d.id);
 INSERT INTO public.products(id,name,slug,description,short_description,price,discount_price,stock,sku,category_id,brand_id,is_featured,is_new,is_best_seller,is_active)
 VALUES(pid,f->>'name',f->>'slug',f->>'description',f->>'short_description',(f->>'price')::numeric,NULLIF(f->>'discount_price','')::numeric,COALESCE(NULLIF(f->>'stock',''),'0')::integer,NULLIF(f->>'sku',''),NULLIF(f->>'category_id','')::uuid,NULLIF(f->>'brand_id','')::uuid,COALESCE((f->>'is_featured')::boolean,false),COALESCE((f->>'is_new')::boolean,false),COALESCE((f->>'is_best_seller')::boolean,false),true)
 ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,description=EXCLUDED.description,short_description=EXCLUDED.short_description,price=EXCLUDED.price,discount_price=EXCLUDED.discount_price,stock=EXCLUDED.stock,sku=EXCLUDED.sku,category_id=EXCLUDED.category_id,brand_id=EXCLUDED.brand_id,is_featured=EXCLUDED.is_featured,is_new=EXCLUDED.is_new,is_best_seller=EXCLUDED.is_best_seller,is_active=true,updated_at=now();
 DELETE FROM public.product_images WHERE product_id=pid;
 pos:=0;
 FOR image IN SELECT * FROM jsonb_array_elements(COALESCE(d.payload->'images','[]')) LOOP
 INSERT INTO public.product_images(product_id,url,sort_order) VALUES(pid,image->>'url',pos); pos:=pos+1;
 END LOOP;
 pos:=0;
 FOR v IN SELECT * FROM jsonb_array_elements(COALESCE(d.payload->'variants','[]')) LOOP
 vid:=COALESCE(NULLIF(v->>'id','')::uuid,gen_random_uuid());
 IF EXISTS(SELECT 1 FROM public.product_variants WHERE id=vid AND product_id<>pid) THEN RAISE EXCEPTION 'Invalid variant'; END IF;
 INSERT INTO public.product_variants(id,product_id,color,color_hex,storage,price,discount_price,stock,sku,sort_order) VALUES(vid,pid,NULLIF(v->>'color',''),NULLIF(v->>'color_hex',''),NULLIF(v->>'storage',''),COALESCE(NULLIF(v->>'price',''),'0')::numeric,NULLIF(v->>'discount_price','')::numeric,COALESCE(NULLIF(v->>'stock',''),'0')::integer,NULLIF(v->>'sku',''),pos)
 ON CONFLICT(id) DO UPDATE SET color=EXCLUDED.color,color_hex=EXCLUDED.color_hex,storage=EXCLUDED.storage,price=EXCLUDED.price,discount_price=EXCLUDED.discount_price,stock=EXCLUDED.stock,sku=EXCLUDED.sku,sort_order=EXCLUDED.sort_order;
 kept:=array_append(kept,vid); pos:=pos+1;
 DELETE FROM public.product_variant_images WHERE variant_id=vid;
 INSERT INTO public.product_variant_images(variant_id,url,sort_order) SELECT vid,x->>'url',ordinality::integer-1 FROM jsonb_array_elements(COALESCE(v->'existingImages','[]')) WITH ORDINALITY AS t(x,ordinality);
 END LOOP;
 DELETE FROM public.product_variants WHERE product_id=pid AND NOT(id=ANY(kept));
 DELETE FROM public.product_drafts WHERE id=d.id;
 RETURN pid;
END $$;
REVOKE ALL ON FUNCTION public.publish_product_draft(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.publish_product_draft(uuid) TO authenticated;