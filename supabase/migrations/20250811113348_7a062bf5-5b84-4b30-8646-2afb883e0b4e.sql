
-- Create electricity providers table
CREATE TABLE public.electricity_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create electricity slabs table
CREATE TABLE public.electricity_slabs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.electricity_providers(id) ON DELETE CASCADE,
  min_unit INTEGER NOT NULL,
  max_unit INTEGER, -- NULL means unlimited
  rate_paise_per_kwh INTEGER NOT NULL, -- Rate in paise per kWh
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create electricity provider config table
CREATE TABLE public.electricity_provider_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.electricity_providers(id) ON DELETE CASCADE,
  fixed_charge_per_kva NUMERIC(10,2) NOT NULL DEFAULT 0,
  meter_rent NUMERIC(10,2) NOT NULL DEFAULT 0,
  duty_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  timely_payment_rebate NUMERIC(5,2) NOT NULL DEFAULT 0,
  lifeline_rate_paise INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id)
);

-- Add RLS policies
ALTER TABLE public.electricity_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electricity_slabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electricity_provider_config ENABLE ROW LEVEL SECURITY;

-- Create policies for electricity_providers
CREATE POLICY "Anyone can view active providers" 
  ON public.electricity_providers 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage providers" 
  ON public.electricity_providers 
  FOR ALL 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create policies for electricity_slabs
CREATE POLICY "Anyone can view slabs for active providers" 
  ON public.electricity_slabs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.electricity_providers ep 
      WHERE ep.id = electricity_slabs.provider_id AND ep.is_active = true
    )
  );

CREATE POLICY "Admins can manage slabs" 
  ON public.electricity_slabs 
  FOR ALL 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create policies for electricity_provider_config
CREATE POLICY "Anyone can view config for active providers" 
  ON public.electricity_provider_config 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.electricity_providers ep 
      WHERE ep.id = electricity_provider_config.provider_id AND ep.is_active = true
    )
  );

CREATE POLICY "Admins can manage provider config" 
  ON public.electricity_provider_config 
  FOR ALL 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Insert default CESC provider and tariff data
INSERT INTO public.electricity_providers (name, is_active) 
VALUES ('CESC (Calcutta Electric Supply Corporation)', true);

-- Get the provider ID for CESC
INSERT INTO public.electricity_slabs (provider_id, min_unit, max_unit, rate_paise_per_kwh)
SELECT 
  ep.id,
  vals.min_unit,
  vals.max_unit,
  vals.rate_paise_per_kwh
FROM public.electricity_providers ep,
(VALUES 
  (0, 25, 518),
  (26, 60, 569),
  (61, 100, 670),
  (101, 150, 745),
  (151, 300, 762),
  (301, NULL, 921)
) AS vals(min_unit, max_unit, rate_paise_per_kwh)
WHERE ep.name = 'CESC (Calcutta Electric Supply Corporation)';

-- Insert CESC configuration
INSERT INTO public.electricity_provider_config (provider_id, fixed_charge_per_kva, meter_rent, duty_percentage, timely_payment_rebate, lifeline_rate_paise)
SELECT 
  ep.id,
  15.00, -- Rs 15 per kVA
  10.00, -- Rs 10 meter rent
  12.00, -- 12% government duty
  1.00,  -- 1% timely payment rebate
  407    -- 407 paise for lifeline consumers (first 25 units)
FROM public.electricity_providers ep
WHERE ep.name = 'CESC (Calcutta Electric Supply Corporation)';

-- Add trigger for updated_at
CREATE TRIGGER update_electricity_providers_updated_at
  BEFORE UPDATE ON public.electricity_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_electricity_provider_config_updated_at
  BEFORE UPDATE ON public.electricity_provider_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
