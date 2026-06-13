
-- 1. Hierarchical categories
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON public.categories(parent_id);

-- 2. product_variants
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color text,
  color_hex text,
  storage text,
  price numeric NOT NULL,
  discount_price numeric,
  stock int NOT NULL DEFAULT 0,
  sku text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_unique_combo
  ON public.product_variants(product_id, COALESCE(color, ''), COALESCE(storage, ''));
CREATE INDEX IF NOT EXISTS product_variants_product_idx ON public.product_variants(product_id);

GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view variants" ON public.product_variants
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage variants" ON public.product_variants
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. product_variant_images
CREATE TABLE IF NOT EXISTS public.product_variant_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS product_variant_images_variant_idx ON public.product_variant_images(variant_id);

GRANT SELECT ON public.product_variant_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variant_images TO authenticated;
GRANT ALL ON public.product_variant_images TO service_role;
ALTER TABLE public.product_variant_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view variant images" ON public.product_variant_images
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage variant images" ON public.product_variant_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Cart variant tracking
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_unique_line
  ON public.cart_items(user_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- 5. Order variant snapshot
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS variant_id uuid,
  ADD COLUMN IF NOT EXISTS variant_label text,
  ADD COLUMN IF NOT EXISTS variant_color text,
  ADD COLUMN IF NOT EXISTS variant_storage text;

-- 6. updated_at trigger for variants
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS product_variants_touch_updated_at ON public.product_variants;
CREATE TRIGGER product_variants_touch_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
