
-- Insert CESC provider with full configuration
INSERT INTO providers (code, name, is_active, supports_lifeline, lifeline_threshold_units, lifeline_requires_registration, supports_timely_rebate, meter_rent, fixed_charge_per_kva, government_duty_percent)
VALUES ('CESC', 'Calcutta Electric Supply Corporation Limited', true, true, 100, false, true, 50.00, 80.00, 16.00)
ON CONFLICT (code) DO NOTHING;

-- Get the CESC provider ID for subsequent inserts
DO $$
DECLARE
    cesc_provider_id uuid;
    domestic_tariff_id uuid;
BEGIN
    -- Get CESC provider ID
    SELECT id INTO cesc_provider_id FROM providers WHERE code = 'CESC';
    
    -- Insert CESC Domestic tariff version for 2024-25
    INSERT INTO tariff_versions (provider_id, code, category, effective_from, is_active, description)
    VALUES (cesc_provider_id, 'DOM-2024-25', 'Domestic', '2024-04-01', true, 'CESC Domestic Consumer Tariff 2024-25')
    ON CONFLICT (provider_id, code) DO NOTHING
    RETURNING id INTO domestic_tariff_id;
    
    -- If the tariff version already exists, get its ID
    IF domestic_tariff_id IS NULL THEN
        SELECT id INTO domestic_tariff_id FROM tariff_versions 
        WHERE provider_id = cesc_provider_id AND code = 'DOM-2024-25';
    END IF;
    
    -- Insert CESC Domestic tariff slabs (2024-25 rates)
    INSERT INTO tariff_slabs (tariff_version_id, min_unit, max_unit, rate_per_unit, position) VALUES
    (domestic_tariff_id, 0, 100, 5.40, 1),     -- First 100 units: ₹5.40/kWh
    (domestic_tariff_id, 101, 200, 6.90, 2),   -- 101-200 units: ₹6.90/kWh
    (domestic_tariff_id, 201, 300, 8.10, 3),   -- 201-300 units: ₹8.10/kWh
    (domestic_tariff_id, 301, 400, 9.90, 4),   -- 301-400 units: ₹9.90/kWh
    (domestic_tariff_id, 401, NULL, 11.40, 5)  -- Above 400 units: ₹11.40/kWh
    ON CONFLICT (tariff_version_id, position) DO NOTHING;
    
    -- Insert FPPCA rates for CESC (sample monthly rates for 2024)
    INSERT INTO fppca_rates (provider_id, year, month, rate_per_unit) VALUES
    (cesc_provider_id, 2024, 1, 1.85),
    (cesc_provider_id, 2024, 2, 1.82),
    (cesc_provider_id, 2024, 3, 1.88),
    (cesc_provider_id, 2024, 4, 1.91),
    (cesc_provider_id, 2024, 5, 1.95),
    (cesc_provider_id, 2024, 6, 2.02),
    (cesc_provider_id, 2024, 7, 2.08),
    (cesc_provider_id, 2024, 8, 2.05),
    (cesc_provider_id, 2024, 9, 1.98),
    (cesc_provider_id, 2024, 10, 1.93),
    (cesc_provider_id, 2024, 11, 1.89),
    (cesc_provider_id, 2024, 12, 1.86)
    ON CONFLICT (provider_id, year, month) DO NOTHING;
    
    -- Insert rebate rules for CESC
    INSERT INTO rebate_rules (provider_id, tariff_version_id, code, description, percent, amount_fixed, applies_to, active) VALUES
    (cesc_provider_id, domestic_tariff_id, 'TIMELY_PAYMENT', 'Timely Payment Rebate', 2.00, 0.00, 'ENERGY_ONLY', true),
    (cesc_provider_id, domestic_tariff_id, 'LIFELINE_SUBSIDY', 'Lifeline Consumer Subsidy', 0.00, 25.00, 'FIXED_ONLY', true)
    ON CONFLICT (provider_id, code) DO NOTHING;
    
END $$;
