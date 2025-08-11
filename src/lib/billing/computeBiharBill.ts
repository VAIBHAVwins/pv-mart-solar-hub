
import { supabase } from '@/integrations/supabase/client';

export interface BiharBillRequest {
  provider_code: string;
  category: 'RURAL_DOMESTIC' | 'URBAN_DOMESTIC';
  year: number;
  month: number;
  units_kwh: number;
  sanctioned_load_kva: number;
  timely_payment_opt_in?: boolean;
  is_lifeline_registered?: boolean;
}

export interface SlabBreakdown {
  min_unit: number;
  max_unit: number | null;
  units: number;
  rate: number;
  amount: number;
}

export interface BiharBillResult {
  provider_code: string;
  category: string;
  year: number;
  month: number;
  units_kwh: number;
  breakdown: {
    energy_charge: number;
    fixed_charge: number;
    fppca_charge: number;
    duty_charge: number;
    meter_rent: number;
    rebates: Record<string, number>;
  };
  total_before_rebate: number;
  total_rebate: number;
  total_payable: number;
  applied_rules: {
    lifeline_applied: boolean;
    timely_payment_applied: boolean;
  };
  slab_wise: SlabBreakdown[];
  warnings?: {
    fppca_missing?: boolean;
  };
}

export async function computeBiharBill(request: BiharBillRequest): Promise<BiharBillResult> {
  const {
    provider_code,
    category,
    year,
    month,
    units_kwh,
    sanctioned_load_kva,
    timely_payment_opt_in = false,
    is_lifeline_registered = false
  } = request;

  // Input validation
  if (month < 1 || month > 12) throw new Error('Invalid month');
  if (year < 2000) throw new Error('Invalid year');
  if (units_kwh < 0) throw new Error('Units cannot be negative');
  if (sanctioned_load_kva < 0) throw new Error('Sanctioned load cannot be negative');

  // Get provider
  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('code', provider_code)
    .eq('is_active', true)
    .single();

  if (providerError || !provider) {
    throw new Error(`Provider ${provider_code} not found or inactive`);
  }

  // Get active tariff version
  const requestDate = new Date(year, month - 1, 1);
  const { data: tariffVersion, error: tariffError } = await supabase
    .from('tariff_versions')
    .select('*')
    .eq('provider_id', provider.id)
    .eq('category', category)
    .eq('is_active', true)
    .lte('effective_from', requestDate.toISOString().split('T')[0])
    .order('effective_from', { ascending: false })
    .limit(1)
    .single();

  if (tariffError || !tariffVersion) {
    throw new Error(`No active tariff found for ${category}`);
  }

  // Get tariff slabs
  const { data: slabs, error: slabsError } = await supabase
    .from('tariff_slabs')
    .select('*')
    .eq('tariff_version_id', tariffVersion.id)
    .order('position');

  if (slabsError || !slabs) {
    throw new Error('Failed to load tariff slabs');
  }

  // Check lifeline eligibility
  const lifeline_applied = provider.supports_lifeline && 
    units_kwh <= provider.lifeline_threshold_units &&
    (!provider.lifeline_requires_registration || is_lifeline_registered);

  // Calculate energy charges using slabs
  let energy_charge = 0;
  let remaining_units = units_kwh;
  const slab_wise: SlabBreakdown[] = [];

  for (const slab of slabs) {
    if (remaining_units <= 0) break;

    const slab_start = slab.min_unit;
    const slab_end = slab.max_unit || Infinity;
    const slab_capacity = Math.min(remaining_units, slab_end - slab_start + 1);
    
    if (slab_capacity > 0) {
      const rate = Number(slab.rate_per_unit);
      const amount = slab_capacity * rate;
      energy_charge += amount;
      remaining_units -= slab_capacity;

      slab_wise.push({
        min_unit: slab_start,
        max_unit: slab.max_unit,
        units: slab_capacity,
        rate,
        amount: Number(amount.toFixed(2))
      });
    }
  }

  // Fixed charges
  const fixed_charge = sanctioned_load_kva * Number(provider.fixed_charge_per_kva);

  // Meter rent
  const meter_rent = Number(provider.meter_rent);

  // FPPCA charges
  let fppca_charge = 0;
  let fppca_missing = false;
  
  const { data: fppca, error: fppcaError } = await supabase
    .from('fppca_rates')
    .select('rate_per_unit')
    .eq('provider_id', provider.id)
    .eq('year', year)
    .eq('month', month)
    .single();

  if (fppca && !fppcaError) {
    fppca_charge = units_kwh * Number(fppca.rate_per_unit);
  } else {
    fppca_missing = true;
  }

  // Government duty
  const duty_charge = (energy_charge + fixed_charge) * (Number(provider.government_duty_percent) / 100);

  // Calculate rebates
  const rebates: Record<string, number> = {};
  let total_rebate = 0;

  const { data: rebateRules } = await supabase
    .from('rebate_rules')
    .select('*')
    .eq('provider_id', provider.id)
    .eq('active', true);

  if (rebateRules) {
    for (const rule of rebateRules) {
      let rebate_amount = 0;
      
      if (rule.code === 'TIMELY_PAYMENT' && timely_payment_opt_in && provider.supports_timely_rebate) {
        if (rule.applies_to === 'ENERGY_AND_FIXED') {
          rebate_amount = (energy_charge + fixed_charge) * (Number(rule.percent) / 100);
        } else if (rule.applies_to === 'TOTAL') {
          rebate_amount = (energy_charge + fixed_charge + fppca_charge + duty_charge + meter_rent) * (Number(rule.percent) / 100);
        }
        rebate_amount += Number(rule.amount_fixed);
      } else if (rule.code === 'GOVT_SUBSIDY') {
        if (rule.applies_to === 'ENERGY') {
          rebate_amount = energy_charge * (Number(rule.percent) / 100);
        }
        rebate_amount += Number(rule.amount_fixed);
      }

      if (rebate_amount > 0) {
        rebates[rule.code] = Number(rebate_amount.toFixed(2));
        total_rebate += rebates[rule.code];
      }
    }
  }

  // Calculate totals
  const total_before_rebate = energy_charge + fixed_charge + fppca_charge + duty_charge + meter_rent;
  const total_payable = total_before_rebate - total_rebate;

  const result: BiharBillResult = {
    provider_code,
    category,
    year,
    month,
    units_kwh,
    breakdown: {
      energy_charge: Number(energy_charge.toFixed(2)),
      fixed_charge: Number(fixed_charge.toFixed(2)),
      fppca_charge: Number(fppca_charge.toFixed(2)),
      duty_charge: Number(duty_charge.toFixed(2)),
      meter_rent: Number(meter_rent.toFixed(2)),
      rebates
    },
    total_before_rebate: Number(total_before_rebate.toFixed(2)),
    total_rebate: Number(total_rebate.toFixed(2)),
    total_payable: Number(total_payable.toFixed(2)),
    applied_rules: {
      lifeline_applied,
      timely_payment_applied: timely_payment_opt_in && provider.supports_timely_rebate
    },
    slab_wise
  };

  if (fppca_missing) {
    result.warnings = { fppca_missing: true };
  }

  return result;
}
