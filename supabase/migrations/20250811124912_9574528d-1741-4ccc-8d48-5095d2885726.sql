
-- Migration: Add Bihar tariff management tables
-- File: 20250811_bihar_tariff_additions.sql

-- Providers table for different electricity providers
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  supports_lifeline boolean NOT NULL DEFAULT false,
  lifeline_threshold_units int NOT NULL DEFAULT 50,
  lifeline_requires_registration boolean NOT NULL DEFAULT false,
  supports_timely_rebate boolean NOT NULL DEFAULT false,
  meter_rent numeric(10,2) NOT NULL DEFAULT 0.00,
  fixed_charge_per_kva numeric(10,2) NOT NULL DEFAULT 0.00,
  government_duty_percent numeric(6,4) DEFAULT 0.00,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tariff versions for time-bound tariff management
CREATE TABLE IF NOT EXISTS tariff_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  code text NOT NULL,
  category text NOT NULL,
  effective_from date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tariff slabs for energy charge calculation
CREATE TABLE IF NOT EXISTS tariff_slabs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tariff_version_id uuid NOT NULL REFERENCES tariff_versions(id) ON DELETE CASCADE,
  min_unit int NOT NULL CHECK (min_unit >= 0),
  max_unit int,
  rate_per_unit numeric(10,4) NOT NULL CHECK (rate_per_unit >= 0),
  position int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- FPPCA rates by month and year
CREATE TABLE IF NOT EXISTS fppca_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  year int NOT NULL CHECK (year >= 2000),
  month int NOT NULL CHECK (month >= 1 AND month <= 12),
  rate_per_unit numeric(10,4) NOT NULL CHECK (rate_per_unit >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider_id, year, month)
);

-- Rebate rules for various discounts and subsidies
CREATE TABLE IF NOT EXISTS rebate_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  tariff_version_id uuid REFERENCES tariff_versions(id) ON DELETE CASCADE,
  code text NOT NULL,
  description text,
  percent numeric(6,4) DEFAULT 0.00,
  amount_fixed numeric(10,2) DEFAULT 0.00,
  applies_to text NOT NULL DEFAULT 'ENERGY_AND_FIXED',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Audit logs for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid,
  entity text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_slabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fppca_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rebate_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Everyone can view active providers and their tariffs
CREATE POLICY "Anyone can view active providers" ON providers
FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active tariff versions" ON tariff_versions
FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view tariff slabs" ON tariff_slabs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM tariff_versions tv 
    WHERE tv.id = tariff_slabs.tariff_version_id 
    AND tv.is_active = true
  )
);

CREATE POLICY "Anyone can view fppca rates" ON fppca_rates
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM providers p 
    WHERE p.id = fppca_rates.provider_id 
    AND p.is_active = true
  )
);

CREATE POLICY "Anyone can view active rebate rules" ON rebate_rules
FOR SELECT USING (active = true);

-- Admin policies for management
CREATE POLICY "Admins can manage providers" ON providers
FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage tariff versions" ON tariff_versions
FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage tariff slabs" ON tariff_slabs
FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage fppca rates" ON fppca_rates
FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage rebate rules" ON rebate_rules
FOR ALL USING (is_admin());

CREATE POLICY "Admins can view audit logs" ON audit_logs
FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert audit logs" ON audit_logs
FOR INSERT WITH CHECK (is_admin());

-- Seed data for Bihar providers
INSERT INTO providers (code, name, supports_lifeline, lifeline_threshold_units, lifeline_requires_registration, supports_timely_rebate, fixed_charge_per_kva, meter_rent, government_duty_percent) VALUES
('NBPCL', 'North Bihar Power Distribution Company Ltd', true, 50, false, true, 50.00, 0.00, 5.00),
('SBPCL', 'South Bihar Power Distribution Company Ltd', true, 50, false, true, 50.00, 0.00, 5.00)
ON CONFLICT (code) DO NOTHING;

-- Seed tariff versions for Bihar
WITH nbpcl_provider AS (SELECT id FROM providers WHERE code = 'NBPCL'),
     sbpcl_provider AS (SELECT id FROM providers WHERE code = 'SBPCL')
INSERT INTO tariff_versions (provider_id, code, category, effective_from, description) VALUES
((SELECT id FROM nbpcl_provider), '2024-25-v1', 'RURAL_DOMESTIC', '2024-04-01', 'Bihar Rural Domestic Tariff 2024-25'),
((SELECT id FROM nbpcl_provider), '2024-25-v1', 'URBAN_DOMESTIC', '2024-04-01', 'Bihar Urban Domestic Tariff 2024-25'),
((SELECT id FROM sbpcl_provider), '2024-25-v1', 'RURAL_DOMESTIC', '2024-04-01', 'Bihar Rural Domestic Tariff 2024-25'),
((SELECT id FROM sbpcl_provider), '2024-25-v1', 'URBAN_DOMESTIC', '2024-04-01', 'Bihar Urban Domestic Tariff 2024-25')
ON CONFLICT DO NOTHING;

-- Seed tariff slabs for Rural Domestic
WITH rural_versions AS (
  SELECT tv.id FROM tariff_versions tv 
  JOIN providers p ON tv.provider_id = p.id 
  WHERE p.code IN ('NBPCL', 'SBPCL') 
  AND tv.category = 'RURAL_DOMESTIC'
)
INSERT INTO tariff_slabs (tariff_version_id, min_unit, max_unit, rate_per_unit, position)
SELECT id, 0, 50, 2.45, 1 FROM rural_versions
UNION ALL
SELECT id, 51, 100, 3.78, 2 FROM rural_versions
UNION ALL
SELECT id, 101, 200, 4.24, 3 FROM rural_versions
UNION ALL
SELECT id, 201, NULL, 5.42, 4 FROM rural_versions
ON CONFLICT DO NOTHING;

-- Seed tariff slabs for Urban Domestic
WITH urban_versions AS (
  SELECT tv.id FROM tariff_versions tv 
  JOIN providers p ON tv.provider_id = p.id 
  WHERE p.code IN ('NBPCL', 'SBPCL') 
  AND tv.category = 'URBAN_DOMESTIC'
)
INSERT INTO tariff_slabs (tariff_version_id, min_unit, max_unit, rate_per_unit, position)
SELECT id, 0, 100, 4.12, 1 FROM urban_versions
UNION ALL
SELECT id, 101, 200, 4.73, 2 FROM urban_versions
UNION ALL
SELECT id, 201, 300, 5.91, 3 FROM urban_versions
UNION ALL
SELECT id, 301, NULL, 6.94, 4 FROM urban_versions
ON CONFLICT DO NOTHING;

-- Seed rebate rules
WITH all_providers AS (SELECT id FROM providers WHERE code IN ('NBPCL', 'SBPCL'))
INSERT INTO rebate_rules (provider_id, code, description, percent, applies_to) 
SELECT id, 'TIMELY_PAYMENT', 'Timely Payment Rebate', 1.00, 'ENERGY_AND_FIXED' FROM all_providers
UNION ALL
SELECT id, 'GOVT_SUBSIDY', 'Government Subsidy', 0.00, 'ENERGY' FROM all_providers
ON CONFLICT DO NOTHING;

-- Seed some sample FPPCA rates
WITH all_providers AS (SELECT id FROM providers WHERE code IN ('NBPCL', 'SBPCL'))
INSERT INTO fppca_rates (provider_id, year, month, rate_per_unit)
SELECT id, 2025, 1, 0.50 FROM all_providers
UNION ALL
SELECT id, 2025, 2, 0.52 FROM all_providers
UNION ALL
SELECT id, 2025, 3, 0.48 FROM all_providers
ON CONFLICT DO NOTHING;
