
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, IndianRupee, Zap, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { enhancedCalculateBill, type EnhancedBillCalculationResult } from '@/lib/billing/enhancedCalculateBill';
import { computeBiharBill, type BiharBillResult } from '@/lib/billing/computeBiharBill';

interface Provider {
  id: string;
  name: string;
  is_active: boolean;
}

const RestoredBillCalculator = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Input states
  const [unitsConsumed, setUnitsConsumed] = useState<number>(0);
  const [sanctionedLoad, setSanctionedLoad] = useState<number>(1.0);
  const [isLifelineConsumer, setIsLifelineConsumer] = useState(false);
  const [timelyPaymentRebate, setTimelyPaymentRebate] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  // Calculation results
  const [billBreakdown, setBillBreakdown] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const fetchProviders = async () => {
    try {
      // Get both electricity providers (CESC) and regular providers (Bihar)
      const [electricityResult, regularResult] = await Promise.all([
        supabase.from('electricity_providers').select('*').eq('is_active', true),
        supabase.from('providers').select('*').eq('is_active', true)
      ]);

      const allProviders: Provider[] = [];
      
      if (electricityResult.data) {
        allProviders.push(...electricityResult.data.map(p => ({ id: p.id, name: p.name, is_active: p.is_active })));
      }
      
      if (regularResult.data) {
        allProviders.push(...regularResult.data.map(p => ({ id: p.id, name: p.name, is_active: p.is_active })));
      }

      setProviders(allProviders);
      
      if (allProviders.length > 0) {
        setSelectedProvider(allProviders[0].name);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load electricity providers.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateBill = async () => {
    if (!selectedProvider) return;
    
    setError(null);
    
    try {
      // Determine if this is Bihar (NBPCL/SBPCL) or CESC provider
      const isBihar = selectedProvider.includes('NBPCL') || selectedProvider.includes('SBPCL');
      
      if (isBihar) {
        // Use Bihar calculation logic
        const result = await computeBiharBill({
          provider_code: selectedProvider,
          year,
          month,
          units_kwh: unitsConsumed,
          sanctioned_load_kva: sanctionedLoad,
          timely_payment_opt_in: timelyPaymentRebate,
          is_lifeline_registered: isLifelineConsumer
        });
        
        setBillBreakdown({
          energyCharges: result.breakdown.energy_charge.toFixed(2),
          fixedCharges: result.breakdown.fixed_charge.toFixed(2),
          fppcaCharges: result.breakdown.fppca_charge.toFixed(2),
          dutyCharges: result.breakdown.duty_charge.toFixed(2),
          meterRent: result.breakdown.meter_rent.toFixed(2),
          rebateAmount: result.total_rebate.toFixed(2),
          totalBeforeRebate: result.total_before_rebate.toFixed(2),
          finalAmount: result.total_payable.toFixed(2),
          slabWise: result.slab_wise,
          appliedRules: result.applied_rules
        });
        
      } else {
        // Use CESC/electricity provider calculation logic
        const result = await enhancedCalculateBill({
          provider_code: selectedProvider,
          year,
          month,
          units_kwh: unitsConsumed,
          sanctioned_load_kva: sanctionedLoad,
          timely_payment_opt_in: timelyPaymentRebate,
          is_lifeline_registered: isLifelineConsumer
        });
        
        setBillBreakdown({
          energyCharges: result.breakdown.energy_charge.toFixed(2),
          fixedCharges: result.breakdown.fixed_charge.toFixed(2),
          fppcaCharges: result.breakdown.fppca_charge.toFixed(2),
          dutyCharges: result.breakdown.duty_charge.toFixed(2),
          meterRent: result.breakdown.meter_rent.toFixed(2),
          rebateAmount: result.total_rebate.toFixed(2),
          totalBeforeRebate: result.total_before_rebate.toFixed(2),
          finalAmount: result.total_payable.toFixed(2),
          slabWise: result.slab_wise,
          appliedRules: result.applied_rules,
          fppcaMissing: result.fppca_missing
        });
        
        if (result.fppca_missing) {
          toast({
            title: "Notice",
            description: `MVCA/FPPCA rate not available for ${months.find(m => m.value === month)?.label} ${year}. Using ₹0.00`,
            variant: "default"
          });
        }
      }
      
    } catch (error) {
      console.error('Calculation error:', error);
      setError(error instanceof Error ? error.message : 'Calculation failed');
      toast({
        title: "Calculation Error",
        description: "Failed to calculate bill. Please check your inputs.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider && unitsConsumed >= 0 && sanctionedLoad >= 0) {
      calculateBill();
    }
  }, [selectedProvider, year, month, unitsConsumed, sanctionedLoad, isLifelineConsumer, timelyPaymentRebate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bill calculator...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Electricity Bill Calculator</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Calculate your electricity bill for Bihar (NBPCL/SBPCL) and CESC providers with accurate slab rates and rebates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Calculation Inputs</CardTitle>
            <CardDescription>
              Enter your consumption details to calculate your electricity bill.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider Selection */}
            <div>
              <Label htmlFor="provider">Electricity Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.name}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2022, 2023, 2024, 2025, 2026].map(yearOption => (
                      <SelectItem key={yearOption} value={yearOption.toString()}>
                        {yearOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="month">Month</Label>
                <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(monthOption => (
                      <SelectItem key={monthOption.value} value={monthOption.value.toString()}>
                        {monthOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Units Consumed */}
            <div>
              <Label htmlFor="units">Units Consumed (kWh)</Label>
              <Input
                id="units"
                type="number"
                min="0"
                step="1"
                value={unitsConsumed}
                onChange={(e) => setUnitsConsumed(parseFloat(e.target.value) || 0)}
                placeholder="Enter units consumed"
              />
            </div>

            {/* Sanctioned Load */}
            <div>
              <Label htmlFor="load">Sanctioned Load (kVA)</Label>
              <Input
                id="load"
                type="number"
                min="0"
                step="0.1"
                value={sanctionedLoad}
                onChange={(e) => setSanctionedLoad(parseFloat(e.target.value) || 0)}
                placeholder="Enter sanctioned load"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lifeline"
                  checked={isLifelineConsumer}
                  onCheckedChange={(checked) => setIsLifelineConsumer(checked === true)}
                />
                <Label htmlFor="lifeline">Life Line Consumer</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rebate"
                  checked={timelyPaymentRebate}
                  onCheckedChange={(checked) => setTimelyPaymentRebate(checked === true)}
                />
                <Label htmlFor="rebate">Timely Payment Rebate</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Bill Breakdown
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your electricity bill
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : billBreakdown ? (
              <div className="space-y-3">
                {billBreakdown.fppcaMissing && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      MVCA/FPPCA rate not available for selected month. Using ₹0.00
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Energy Charges:</span>
                  <span className="font-medium">₹{billBreakdown.energyCharges}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Fixed Charges:</span>
                  <span className="font-medium">₹{billBreakdown.fixedCharges}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">MVCA/FPPCA Charges:</span>
                  <span className="font-medium">₹{billBreakdown.fppcaCharges}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Government Duty:</span>
                  <span className="font-medium">₹{billBreakdown.dutyCharges}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Meter Rent:</span>
                  <span className="font-medium">₹{billBreakdown.meterRent}</span>
                </div>
                {timelyPaymentRebate && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-green-600">Rebate:</span>
                    <span className="font-medium text-green-600">-₹{billBreakdown.rebateAmount}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg font-bold">
                  <span>Total Payable Amount:</span>
                  <span className="text-green-600">₹{billBreakdown.finalAmount}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter your details to calculate bill</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Slab-wise Breakdown */}
      {billBreakdown?.slabWise && billBreakdown.slabWise.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Slab-wise Energy Charges</CardTitle>
            <CardDescription>
              Detailed breakdown of energy charges by consumption slabs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Units Range</th>
                    <th className="text-right py-2">Units Used</th>
                    <th className="text-right py-2">Rate (₹/kWh)</th>
                    <th className="text-right py-2">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {billBreakdown.slabWise.map((slab: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">
                        {slab.min_unit}-{slab.max_unit || '∞'}
                      </td>
                      <td className="text-right py-2">{slab.units}</td>
                      <td className="text-right py-2">{slab.rate.toFixed(2)}</td>
                      <td className="text-right py-2 font-medium">{slab.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RestoredBillCalculator;
