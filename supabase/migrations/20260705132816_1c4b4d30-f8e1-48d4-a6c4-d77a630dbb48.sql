
-- 1. Orders UPDATE policy: admins only
DROP POLICY IF EXISTS "Owners or admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Convert has_role to SECURITY INVOKER. user_roles already has an RLS
-- policy that lets authenticated users read their own rows, and RLS policies
-- typically call has_role(auth.uid(), ...), so invoker mode is sufficient.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
