
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedBillCalculationParams {
  provider_code: string;
  year: number;
  month: number;
  units_kwh: number;
  sanctioned_load_kva: number;
  timely_payment_opt_in?: boolean;
  is_lifeline_registered?: boolean;
}

export interface EnhancedBillCalculationResult {
  provider_code: string;
  year: number;
  month: number;
  days_in_month: number;
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
  slab_wise: Array<{
    min_unit: number;
    max_unit: number | null;
    units: number;
    rate: number;
    amount: number;
  }>;
  fppca_missing?: boolean;
}

export async function enhancedCalculateBill(params: EnhancedBillCalculationParams): Promise<EnhancedBillCalculationResult> {
  const {
    provider_code,
    year,
    month,
    units_kwh,
    sanctioned_load_kva,
    timely_payment_opt_in = false,
    is_lifeline_registered = false
  } = params;

  // Validate inputs
  if (year < 2000 || year > 2100) throw new Error('Invalid year');
  if (month < 1 || month > 12) throw new Error('Invalid month');
  if (units_kwh < 0) throw new Error('Units cannot be negative');
  if (sanctioned_load_kva < 0) throw new Error('Sanctioned load cannot be negative');

  // Calculate days in month
  const days_in_month = new Date(year, month, 0).getDate();

  // Load provider
  const { data: provider, error: providerError } = await supabase
    .from('electricity_providers')
    .select('*')
    .eq('name', provider_code)
    .eq('is_active', true)
    .single();

  if (providerError || !provider) {
    throw new Error(`Provider ${provider_code} not found or inactive`);
  }

  // Load slabs
  const { data: slabs, error: slabsError } = await supabase
    .from('electricity_slabs')
    .select('*')
    .eq('provider_id', provider.id)
    .order('min_unit');

  if (slabsError || !slabs) {
    throw new Error('Failed to load provider slabs');
  }

  // Calculate energy charges using slabs
  let energy_charge = 0;
  let remaining_units = units_kwh;
  const slab_wise: Array<{min_unit: number, max_unit: number | null, units: number, rate: number, amount: number}> = [];

  for (const slab of slabs) {
    if (remaining_units <= 0) break;

    const slab_start = slab.min_unit;
    const slab_end = slab.max_unit || Infinity;
    const slab_capacity = slab_end === Infinity ? remaining_units : Math.min(remaining_units, slab_end - slab_start + 1);
    
    if (slab_capacity > 0) {
      const rate_rupees = Number(slab.rate_paise_per_kwh) / 100;
      const amount = slab_capacity * rate_rupees;
      energy_charge += amount;
      remaining_units -= slab_capacity;

      slab_wise.push({
        min_unit: slab_start,
        max_unit: slab.max_unit,
        units: slab_capacity,
        rate: rate_rupees,
        amount: Number(amount.toFixed(2))
      });
    }
  }

  // Load provider config
  const { data: providerConfig } = await supabase
    .from('electricity_provider_config')
    .select('*')
    .eq('provider_id', provider.id)
    .single();

  // Fixed charge
  const fixed_charge = sanctioned_load_kva * Number(providerConfig?.fixed_charge_per_kva || 15.00);

  // FPPCA charge - check for specific month/year rate
  let fppca_charge = 0;
  let fppca_missing = false;
  
  const { data: fppcaRate } = await supabase
    .from('electricity_fppca_rates')
    .select('rate_per_unit')
    .eq('provider_id', provider.id)
    .eq('year', year)
    .eq('month', month)
    .single();

  if (fppcaRate) {
    fppca_charge = units_kwh * Number(fppcaRate.rate_per_unit);
  } else {
    fppca_missing = true;
  }

  // Duty charges
  const duty_charge = (energy_charge + fixed_charge + fppca_charge) * (Number(providerConfig?.duty_percentage || 10) / 100);

  // Meter rent
  const meter_rent = Number(providerConfig?.meter_rent || 10.00);

  // Calculate rebates
  const rebates: Record<string, number> = {};
  let total_rebate = 0;

  if (timely_payment_opt_in && providerConfig?.timely_payment_rebate) {
    const rebate_amount = (energy_charge + fixed_charge) * (Number(providerConfig.timely_payment_rebate) / 100);
    rebates.timely_payment = Number(rebate_amount.toFixed(2));
    total_rebate += rebates.timely_payment;
  }

  // Calculate totals
  const total_before_rebate = energy_charge + fixed_charge + fppca_charge + duty_charge + meter_rent;
  const total_payable = total_before_rebate - total_rebate;

  const result: EnhancedBillCalculationResult = {
    provider_code,
    year,
    month,
    days_in_month,
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
      lifeline_applied: false, // CESC doesn't use lifeline in our current setup
      timely_payment_applied: timely_payment_opt_in && !!providerConfig?.timely_payment_rebate
    },
    slab_wise
  };

  if (fppca_missing) {
    result.fppca_missing = true;
  }

  return result;
}
