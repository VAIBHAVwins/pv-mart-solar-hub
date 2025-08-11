
import { calculateBill } from '../src/lib/billing/calculateBill';

describe('calculateBill', () => {
  test('should calculate CESC bill for 350 units correctly', async () => {
    const result = await calculateBill({
      provider_code: 'CESC',
      year: 2025,
      month: 1,
      units_kwh: 350,
      sanctioned_load_kva: 1.0,
      timely_payment_opt_in: false,
      is_lifeline_registered: false
    });

    expect(result.provider_code).toBe('CESC');
    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.days_in_month).toBe(31);
    expect(result.units_kwh).toBe(350);
    expect(result.breakdown.energy_charge).toBeCloseTo(2572.65, 2);
    expect(result.breakdown.fixed_charge).toBe(15.00);
    expect(result.breakdown.meter_rent).toBe(10.00);
    expect(result.applied_rules.lifeline_applied).toBe(false);
    expect(result.total_payable).toBeGreaterThan(0);
  });

  test('should apply lifeline rate for 20 units', async () => {
    const result = await calculateBill({
      provider_code: 'CESC',
      year: 2025,
      month: 1,
      units_kwh: 20,
      sanctioned_load_kva: 1.0,
      timely_payment_opt_in: false,
      is_lifeline_registered: false
    });

    expect(result.applied_rules.lifeline_applied).toBe(true);
    expect(result.slab_wise.length).toBeGreaterThan(0);
  });

  test('should handle missing FPPCA rate gracefully', async () => {
    const result = await calculateBill({
      provider_code: 'CESC',
      year: 2030,
      month: 12,
      units_kwh: 100,
      sanctioned_load_kva: 1.0,
      timely_payment_opt_in: false,
      is_lifeline_registered: false
    });

    expect(result.breakdown.fppca_charge).toBe(0);
    expect(result.fppca_missing).toBe(true);
  });

  test('should apply timely payment rebate when opted in', async () => {
    const result = await calculateBill({
      provider_code: 'CESC',
      year: 2025,
      month: 1,
      units_kwh: 100,
      sanctioned_load_kva: 1.0,
      timely_payment_opt_in: true,
      is_lifeline_registered: false
    });

    expect(result.applied_rules.timely_payment_applied).toBe(true);
    expect(result.total_rebate).toBeGreaterThan(0);
  });

  test('should validate input parameters', async () => {
    await expect(calculateBill({
      provider_code: 'CESC',
      year: 1999,
      month: 1,
      units_kwh: 100,
      sanctioned_load_kva: 1.0
    })).rejects.toThrow('Invalid year');

    await expect(calculateBill({
      provider_code: 'CESC',
      year: 2025,
      month: 13,
      units_kwh: 100,
      sanctioned_load_kva: 1.0
    })).rejects.toThrow('Invalid month');

    await expect(calculateBill({
      provider_code: 'CESC',
      year: 2025,
      month: 1,
      units_kwh: -10,
      sanctioned_load_kva: 1.0
    })).rejects.toThrow('Units cannot be negative');
  });
});
