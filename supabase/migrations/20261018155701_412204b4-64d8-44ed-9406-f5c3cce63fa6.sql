REVOKE ALL ON public.product_drafts FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.admin_product_drafts(_action text, _id uuid DEFAULT NULL, _product_id uuid DEFAULT NULL, _title text DEFAULT '', _payload jsonb DEFAULT '{}'::jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admin access required'; END IF;
 IF _action='list' THEN SELECT COALESCE(jsonb_agg(to_jsonb(d) ORDER BY updated_at DESC),'[]'::jsonb) INTO result FROM public.product_drafts d;
 ELSIF _action='save' THEN
 INSERT INTO public.product_drafts(id,product_id,title,payload) VALUES(COALESCE(_id,gen_random_uuid()),_product_id,_title,_payload) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,payload=EXCLUDED.payload;
 SELECT to_jsonb(d) INTO result FROM public.product_drafts d WHERE id=_id;
 ELSIF _action='delete' THEN DELETE FROM public.product_drafts WHERE id=_id; result:='null'::jsonb;
 ELSE RAISE EXCEPTION 'Invalid action'; END IF;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.admin_product_drafts(text,uuid,uuid,text,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_product_drafts(text,uuid,uuid,text,jsonb) TO authenticated;
ALTER FUNCTION public.publish_product_draft(uuid) SECURITY DEFINER;