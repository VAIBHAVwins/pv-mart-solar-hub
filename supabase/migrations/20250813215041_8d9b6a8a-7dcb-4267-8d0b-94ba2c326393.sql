
-- SECURITY HARDENING + CESC DATA READINESS
-- NOTE: This migration tightens access to sensitive data and seeds/structures CESC billing data.
-- It will NOT break authenticated flows. If you currently accept anonymous customer requirement submissions,
-- we'll route those via an Edge Function in the next step.

-- 1) Harden vendor_profiles
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Drop permissive or conflicting legacy policies (idempotent)
DROP POLICY IF EXISTS "Admins can view all vendor profiles" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Vendor profile access" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Vendors can view their own profile" ON public.vendor_profiles;
DROP POLICY IF EXISTS "admins_manage_vendor_profiles" ON public.vendor_profiles;
DROP POLICY IF EXISTS "vendors_select_own" ON public.vendor_profiles;
DROP POLICY IF EXISTS "vendors_insert_own" ON public.vendor_profiles;
DROP POLICY IF EXISTS "vendors_update_own" ON public.vendor_profiles;
DROP POLICY IF EXISTS "admins_delete_vendor_profiles" ON public.vendor_profiles;

-- Admins can manage all vendor profiles
CREATE POLICY "admins_manage_vendor_profiles"
  ON public.vendor_profiles
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Vendors can view their own profile
CREATE POLICY "vendors_select_own"
  ON public.vendor_profiles
  FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- Vendors can insert their own profile
CREATE POLICY "vendors_insert_own"
  ON public.vendor_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Vendors can update their own profile; admins too
CREATE POLICY "vendors_update_own"
  ON public.vendor_profiles
  FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Admins may delete
CREATE POLICY "admins_delete_vendor_profiles"
  ON public.vendor_profiles
  FOR DELETE
  USING (is_admin());

-- 2) Harden customer_requirements
ALTER TABLE public.customer_requirements ENABLE ROW LEVEL SECURITY;

-- Drop legacy policies to replace with tighter ones
DROP POLICY IF EXISTS "Admins can view all requirements" ON public.customer_requirements;
DROP POLICY IF EXISTS "Customers can view their own requirements" ON public.customer_requirements;
DROP POLICY IF EXISTS "admins_manage_customer_requirements" ON public.customer_requirements;
DROP POLICY IF EXISTS "customers_insert_own_requirements" ON public.customer_requirements;
DROP POLICY IF EXISTS "customers_select_own_requirements" ON public.customer_requirements;
DROP POLICY IF EXISTS "customers_update_own_requirements" ON public.customer_requirements;
DROP POLICY IF EXISTS "authenticated_can_insert_requirements" ON public.customer_requirements;

-- Admins can manage all
CREATE POLICY "admins_manage_customer_requirements"
  ON public.customer_requirements
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Authenticated customers can insert their own requirements
CREATE POLICY "customers_insert_own_requirements"
  ON public.customer_requirements
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND customer_id = auth.uid());

-- Owners can view their own requirements
CREATE POLICY "customers_select_own_requirements"
  ON public.customer_requirements
  FOR SELECT
  USING (customer_id = auth.uid() OR is_admin());

-- Owners can update their own requirements
CREATE POLICY "customers_update_own_requirements"
  ON public.customer_requirements
  FOR UPDATE
  USING (customer_id = auth.uid() OR is_admin())
  WITH CHECK (customer_id = auth.uid() OR is_admin());

-- 3) CESC MVCA/FPPCA table (for electricity providers)
CREATE TABLE IF NOT EXISTS public.electricity_fppca_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.electricity_providers(id) ON DELETE CASCADE,
  year integer NOT NULL,
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  rate_per_unit numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, year, month)
);

ALTER TABLE public.electricity_fppca_rates ENABLE ROW LEVEL SECURITY;

-- Admins manage MVCA
DROP POLICY IF EXISTS "admins_manage_electricity_fppca" ON public.electricity_fppca_rates;
CREATE POLICY "admins_manage_electricity_fppca"
  ON public.electricity_fppca_rates
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Anyone can read MVCA for active electricity providers
DROP POLICY IF EXISTS "anyone_select_active_electricity_fppca" ON public.electricity_fppca_rates;
CREATE POLICY "anyone_select_active_electricity_fppca"
  ON public.electricity_fppca_rates
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.electricity_providers ep
    WHERE ep.id = electricity_fppca_rates.provider_id AND ep.is_active = true
  ));

-- 4) Seed/Upsert CESC electricity provider, config and slabs
DO $$
DECLARE
  cesc_id uuid;
BEGIN
  SELECT id INTO cesc_id FROM public.electricity_providers WHERE name = 'CESC' LIMIT 1;
  IF cesc_id IS NULL THEN
    INSERT INTO public.electricity_providers (name, is_active) VALUES ('CESC', true)
    RETURNING id INTO cesc_id;
  END IF;

  -- Upsert provider config (defaults based on your brief; editable in admin)
  IF EXISTS (SELECT 1 FROM public.electricity_provider_config WHERE provider_id = cesc_id) THEN
    UPDATE public.electricity_provider_config
      SET fixed_charge_per_kva = 15.00,
          meter_rent = 10.00,
          duty_percentage = 10.00,
          timely_payment_rebate = 1.00,
          lifeline_rate_paise = 0,
          updated_at = now()
      WHERE provider_id = cesc_id;
  ELSE
    INSERT INTO public.electricity_provider_config
      (provider_id, fixed_charge_per_kva, meter_rent, duty_percentage, timely_payment_rebate, lifeline_rate_paise)
      VALUES (cesc_id, 15.00, 10.00, 10.00, 1.00, 0);
  END IF;

  -- Replace slabs with official domestic slabs (p/kWh) as per 2024-25 schedule
  DELETE FROM public.electricity_slabs WHERE provider_id = cesc_id;

  INSERT INTO public.electricity_slabs (provider_id, min_unit, max_unit, rate_paise_per_kwh)
  VALUES
    (cesc_id, 1,   25,  518),
    (cesc_id, 26,  60,  569),
    (cesc_id, 61,  100, 670),
    (cesc_id, 101, 150, 745),
    (cesc_id, 151, 300, 762),
    (cesc_id, 301, NULL, 921);
END $$;
