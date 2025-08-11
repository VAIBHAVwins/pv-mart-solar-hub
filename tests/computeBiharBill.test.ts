
import { computeBiharBill } from '../src/lib/billing/computeBiharBill';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              single: jest.fn()
            }))
          })),
          lte: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                single: jest.fn()
              }))
            }))
          }))
        }))
      }))
    }))
  }
}));

describe('computeBiharBill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should validate input parameters', async () => {
    await expect(computeBiharBill({
      provider_code: 'NBPCL',
      category: 'RURAL_DOMESTIC',
      year: 1999,
      month: 1,
      units_kwh: 100,
      sanctioned_load_kva: 1.0
    })).rejects.toThrow('Invalid year');

    await expect(computeBiharBill({
      provider_code: 'NBPCL',
      category: 'RURAL_DOMESTIC',
      year: 2025,
      month: 13,
      units_kwh: 100,
      sanctioned_load_kva: 1.0
    })).rejects.toThrow('Invalid month');

    await expect(computeBiharBill({
      provider_code: 'NBPCL',
      category: 'RURAL_DOMESTIC',
      year: 2025,
      month: 1,
      units_kwh: -10,
      sanctioned_load_kva: 1.0
    })).rejects.toThrow('Units cannot be negative');

    await expect(computeBiharBill({
      provider_code: 'NBPCL',
      category: 'RURAL_DOMESTIC',
      year: 2025,
      month: 1,
      units_kwh: 100,
      sanctioned_load_kva: -1.0
    })).rejects.toThrow('Sanctioned load cannot be negative');
  });

  test('should calculate Rural Domestic bill correctly for 40 units', async () => {
    // Mock provider data
    const mockProvider = {
      id: 'provider-1',
      code: 'NBPCL',
      name: 'North Bihar Power Distribution Company Ltd',
      supports_lifeline: true,
      lifeline_threshold_units: 50,
      lifeline_requires_registration: false,
      supports_timely_rebate: true,
      fixed_charge_per_kva: 50.00,
      meter_rent: 0.00,
      government_duty_percent: 5.00
    };

    const mockTariffVersion = {
      id: 'tariff-1',
      provider_id: 'provider-1',
      code: '2024-25-v1',
      category: 'RURAL_DOMESTIC',
      effective_from: '2024-04-01',
      is_active: true
    };

    const mockSlabs = [
      {
        id: 'slab-1',
        tariff_version_id: 'tariff-1',
        min_unit: 0,
        max_unit: 50,
        rate_per_unit: 2.45,
        position: 1
      }
    ];

    const mockFppca = {
      rate_per_unit: 0.50
    };

    const mockRebateRules = [
      {
        id: 'rebate-1',
        provider_id: 'provider-1',
        code: 'TIMELY_PAYMENT',
        percent: 1.00,
        amount_fixed: 0.00,
        applies_to: 'ENERGY_AND_FIXED',
        active: true
      }
    ];

    // Mock Supabase responses
    require('@/integrations/supabase/client').supabase.from.mockImplementation((table: string) => {
      const mockChain = {
        select: jest.fn(() => mockChain),
        eq: jest.fn(() => mockChain),
        lte: jest.fn(() => mockChain),
        order: jest.fn(() => mockChain),
        limit: jest.fn(() => mockChain),
        single: jest.fn()
      };

      if (table === 'providers') {
        mockChain.single.mockResolvedValue({ data: mockProvider, error: null });
      } else if (table === 'tariff_versions') {
        mockChain.single.mockResolvedValue({ data: mockTariffVersion, error: null });
      } else if (table === 'tariff_slabs') {
        mockChain.single = undefined;
        return {
          ...mockChain,
          select: jest.fn(() => ({
            ...mockChain,
            eq: jest.fn(() => ({
              ...mockChain,
              order: jest.fn().mockResolvedValue({ data: mockSlabs, error: null })
            }))
          }))
        };
      } else if (table === 'fppca_rates') {
        mockChain.single.mockResolvedValue({ data: mockFppca, error: null });
      } else if (table === 'rebate_rules') {
        mockChain.single = undefined;
        return {
          ...mockChain,
          select: jest.fn().mockResolvedValue({ data: mockRebateRules, error: null })
        };
      }

      return mockChain;
    });

    const result = await computeBiharBill({
      provider_code: 'NBPCL',
      category: 'RURAL_DOMESTIC',
      year: 2025,
      month: 1,
      units_kwh: 40,
      sanctioned_load_kva: 1.0,
      timely_payment_opt_in: false,
      is_lifeline_registered: false
    });

    expect(result.provider_code).toBe('NBPCL');
    expect(result.category).toBe('RURAL_DOMESTIC');
    expect(result.units_kwh).toBe(40);
    expect(result.breakdown.energy_charge).toBe(98.00); // 40 * 2.45
    expect(result.breakdown.fixed_charge).toBe(50.00); // 1.0 * 50.00
    expect(result.breakdown.fppca_charge).toBe(20.00); // 40 * 0.50
    expect(result.applied_rules.lifeline_applied).toBe(true); // 40 <= 50
    expect(result.total_payable).toBeGreaterThan(0);
  });

  test('should calculate Urban Domestic bill correctly for 150 units', async () => {
    const mockProvider = {
      id: 'provider-1',
      code: 'NBPCL',
      name: 'North Bihar Power Distribution Company Ltd',
      supports_lifeline: true,
      lifeline_threshold_units: 50,
      lifeline_requires_registration: false,
      supports_timely_rebate: true,
      fixed_charge_per_kva: 50.00,
      meter_rent: 0.00,
      government_duty_percent: 5.00
    };

    const mockTariffVersion = {
      id: 'tariff-1',
      provider_id: 'provider-1',
      code: '2024-25-v1',
      category: 'URBAN_DOMESTIC',
      effective_from: '2024-04-01',
      is_active: true
    };

    const mockSlabs = [
      {
        id: 'slab-1',
        tariff_version_id: 'tariff-1',
        min_unit: 0,
        max_unit: 100,
        rate_per_unit: 4.12,
        position: 1
      },
      {
        id: 'slab-2',
        tariff_version_id: 'tariff-1',
        min_unit: 101,
        max_unit: 200,
        rate_per_unit: 4.73,
        position: 2
      }
    ];

    // Mock Supabase responses for Urban case
    require('@/integrations/supabase/client').supabase.from.mockImplementation((table: string) => {
      const mockChain = {
        select: jest.fn(() => mockChain),
        eq: jest.fn(() => mockChain),
        lte: jest.fn(() => mockChain),
        order: jest.fn(() => mockChain),
        limit: jest.fn(() => mockChain),
        single: jest.fn()
      };

      if (table === 'providers') {
        mockChain.single.mockResolvedValue({ data: mockProvider, error: null });
      } else if (table === 'tariff_versions') {
        mockChain.single.mockResolvedValue({ data: mockTariffVersion, error: null });
      } else if (table === 'tariff_slabs') {
        mockChain.single = undefined;
        return {
          ...mockChain,
          select: jest.fn(() => ({
            ...mockChain,
            eq: jest.fn(() => ({
              ...mockChain,
              order: jest.fn().mockResolvedValue({ data: mockSlabs, error: null })
            }))
          }))
        };
      } else if (table === 'fppca_rates') {
        mockChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      } else if (table === 'rebate_rules') {
        mockChain.single = undefined;
        return {
          ...mockChain,
          select: jest.fn().mockResolvedValue({ data: [], error: null })
        };
      }

      return mockChain;
    });

    const result = await computeBiharBill({
      provider_code: 'NBPCL',
      category: 'URBAN_DOMESTIC',
      year: 2025,
      month: 1,
      units_kwh: 150,
      sanctioned_load_kva: 1.0,
      timely_payment_opt_in: false,
      is_lifeline_registered: false
    });

    // Verify slab allocation: first 100 at 4.12, next 50 at 4.73
    expect(result.slab_wise).toHaveLength(2);
    expect(result.slab_wise[0].units).toBe(100);
    expect(result.slab_wise[0].rate).toBe(4.12);
    expect(result.slab_wise[0].amount).toBe(412.00);
    expect(result.slab_wise[1].units).toBe(50);
    expect(result.slab_wise[1].rate).toBe(4.73);
    expect(result.slab_wise[1].amount).toBe(236.50);
    expect(result.breakdown.energy_charge).toBe(648.50); // 412.00 + 236.50
    expect(result.applied_rules.lifeline_applied).toBe(false); // 150 > 50
  });

  test('should handle missing FPPCA rate gracefully', async () => {
    const mockProvider = {
      id: 'provider-1',
      code: 'NBPCL',
      supports_lifeline: false,
      lifeline_threshold_units: 50,
      lifeline_requires_registration: false,
      supports_timely_rebate: false,
      fixed_charge_per_kva: 50.00,
      meter_rent: 0.00,
      government_duty_percent: 5.00
    };

    const mockTariffVersion = {
      id: 'tariff-1',
      provider_id: 'provider-1',
      category: 'RURAL_DOMESTIC',
      is_active: true
    };

    const mockSlabs = [
      {
        id: 'slab-1',
        min_unit: 0,
        max_unit: 50,
        rate_per_unit: 2.45,
        position: 1
      }
    ];

    require('@/integrations/supabase/client').supabase.from.mockImplementation((table: string) => {
      const mockChain = {
        select: jest.fn(() => mockChain),
        eq: jest.fn(() => mockChain),
        lte: jest.fn(() => mockChain),
        order: jest.fn(() => mockChain),
        limit: jest.fn(() => mockChain),
        single: jest.fn()
      };

      if (table === 'providers') {
        mockChain.single.mockResolvedValue({ data: mockProvider, error: null });
      } else if (table === 'tariff_versions') {
        mockChain.single.mockResolvedValue({ data: mockTariffVersion, error: null });
      } else if (table === 'tariff_slabs') {
        mockChain.single = undefined;
        return {
          ...mockChain,
          select: jest.fn(() => ({
            ...mockChain,
            eq: jest.fn(() => ({
              ...mockChain,
              order: jest.fn().mockResolvedValue({ data: mockSlabs, error: null })
            }))
          }))
        };
      } else if (table === 'fppca_rates') {
        mockChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      } else if (table === 'rebate_rules') {
        mockChain.single = undefined;
        return {
          ...mockChain,
          select: jest.fn().mockResolvedValue({ data: [], error: null })
        };
      }

      return mockChain;
    });

    const result = await computeBiharBill({
      provider_code: 'NBPCL',
      category: 'RURAL_DOMESTIC',
      year: 2030,
      month: 12,
      units_kwh: 100,
      sanctioned_load_kva: 1.0,
      timely_payment_opt_in: false,
      is_lifeline_registered: false
    });

    expect(result.breakdown.fppca_charge).toBe(0);
    expect(result.warnings?.fppca_missing).toBe(true);
  });
});
