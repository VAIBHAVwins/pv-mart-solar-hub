
-- Add free units rules table for government schemes like "125 units free"
CREATE TABLE IF NOT EXISTS free_units_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  code text NOT NULL,
  description text,
  free_units int NOT NULL CHECK (free_units >= 0),
  effective_from date NOT NULL,
  effective_to date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Policy
ALTER TABLE free_units_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active free units rules" ON free_units_rules
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage free units rules" ON free_units_rules
FOR ALL USING (is_admin());

-- Seed Bihar "125 units free" scheme effective from August 1, 2025
WITH bihar_providers AS (SELECT id FROM providers WHERE code IN ('NBPCL', 'SBPCL'))
INSERT INTO free_units_rules (provider_id, code, description, free_units, effective_from)
SELECT id, 'GOVT_FREE_UNITS', 'Bihar Government 125 Units Free Scheme', 125, '2025-08-01'
FROM bihar_providers
ON CONFLICT DO NOTHING;

-- Update tariff versions effective_from to current period to fix "no active tariff" error
UPDATE tariff_versions 
SET effective_from = '2025-01-01' 
WHERE effective_from < '2025-01-01' 
AND provider_id IN (SELECT id FROM providers WHERE code IN ('NBPCL', 'SBPCL'));
