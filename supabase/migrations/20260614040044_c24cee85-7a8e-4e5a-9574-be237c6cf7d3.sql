
-- Trigger / internal functions: not callable via API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- Coupon increment: server-side only (edge functions use service_role)
REVOKE EXECUTE ON FUNCTION public.increment_coupon_usage(text) FROM PUBLIC, anon, authenticated;

-- has_role: required by RLS policies for signed-in users; keep authenticated, revoke anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
