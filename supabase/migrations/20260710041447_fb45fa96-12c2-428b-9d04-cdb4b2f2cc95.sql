CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_touch
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_settings (key, value) VALUES
  ('hero', jsonb_build_object(
    'image_url', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=600&fit=crop',
    'headline', 'Experience',
    'morph_words', ARRAY['Innovation','Technology','Excellence','The Future'],
    'subheadline', 'Discover premium electronics that redefine your everyday. Curated devices from the world''s most innovative brands.',
    'primary_cta_label', 'Explore Products',
    'primary_cta_href', '/shop',
    'secondary_cta_label', 'Browse Categories',
    'secondary_cta_href', '/categories'
  ))
ON CONFLICT (key) DO NOTHING;