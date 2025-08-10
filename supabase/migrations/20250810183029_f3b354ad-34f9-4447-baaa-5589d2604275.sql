
-- 1) ensure admin_users exists
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2) helper to check admin from RLS-safe context
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = auth.email() AND au.is_active = true
  );
$$;

-- 3) ensure first admin (idempotent)
INSERT INTO public.admin_users (email, full_name, is_active)
VALUES ('ankurvaibhav22@gmail.com', 'First Admin', true)
ON CONFLICT (email) DO NOTHING;

-- 4) enable RLS and give admin manage rights on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins manage admin_users" ON public.admin_users;
CREATE POLICY "admins manage admin_users"
  ON public.admin_users
  AS PERMISSIVE
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
