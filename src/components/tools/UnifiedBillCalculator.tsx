
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calculator, IndianRupee, Zap, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { computeBiharBill, type BiharBillResult } from '@/lib/billing/computeBiharBill';
import { calculateBill, type BillCalculationResult } from '@/lib/billing/calculateBill';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Provider {
  id: string;
  code?: string;
  name: string;
  is_active: boolean;
  supports_lifeline?: boolean;
  lifeline_requires_registration?: boolean;
  supports_timely_rebate?: boolean;
}

type UnifiedBillResult = BiharBillResult | BillCalculationResult;

const UnifiedBillCalculator = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  
  // Get current date for default values (always current month)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  // Input states - always use current month
  const [category, setCategory] = useState<'RURAL_DOMESTIC' | 'URBAN_DOMESTIC'>('RURAL_DOMESTIC');
  const [unitsConsumed, setUnitsConsumed] = useState<number>(0);
  const [sanctionedLoad, setSanctionedLoad] = useState<number>(1.0);
  const [timelyPaymentOptIn, setTimelyPaymentOptIn] = useState(false);
  const [isLifelineRegistered, setIsLifelineRegistered] = useState(false);
  
  // Results
  const [billResult, setBillResult] = useState<UnifiedBillResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  
  const { toast } = useToast();

  const categoryOptions = [
    { value: 'RURAL_DOMESTIC', label: 'Rural Domestic' },
    { value: 'URBAN_DOMESTIC', label: 'Urban Domestic' }
  ];

  const fetchProviders = async () => {
    try {
      // Fetch both Bihar providers and CESC providers
      const [biharResponse, cescResponse] = await Promise.all([
        supabase
          .from('providers')
          .select('*')
          .eq('is_active', true)
          .in('code', ['NBPCL', 'SBPCL'])
          .order('name'),
        supabase
          .from('electricity_providers')
          .select('*')
          .eq('is_active', true)
          .order('name')
      ]);

      const biharProviders = (biharResponse.data || []).map(p => ({
        ...p,
        type: 'bihar'
      }));
      
      const cescProviders = (cescResponse.data || []).map(p => ({
        ...p,
        type: 'cesc'
      }));

      const allProviders = [...biharProviders, ...cescProviders];
      setProviders(allProviders);
      
      if (allProviders.length > 0) {
        setSelectedProvider(allProviders[0]);
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

  const isBiharProvider = (provider: Provider) => {
    return provider.code && ['NBPCL', 'SBPCL'].includes(provider.code);
  };

  const handleCalculate = async () => {
    if (!selectedProvider) {
      toast({
        title: "Error",
        description: "Please select a provider first.",
        variant: "destructive"
      });
      return;
    }

    if (unitsConsumed < 0 || sanctionedLoad <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid consumption and load values.",
        variant: "destructive"
      });
      return;
    }

    setCalculating(true);
    setError(null);
    setBillResult(null);

    try {
      let result: UnifiedBillResult;

      if (isBiharProvider(selectedProvider)) {
        // Use Bihar calculation logic
        result = await computeBiharBill({
          provider_code: selectedProvider.code!,
          category,
          year: currentYear,
          month: currentMonth,
          units_kwh: unitsConsumed,
          sanctioned_load_kva: sanctionedLoad,
          timely_payment_opt_in: timelyPaymentOptIn,
          is_lifeline_registered: isLifelineRegistered
        });
      } else {
        // Use CESC calculation logic
        result = await calculateBill({
          provider_code: selectedProvider.name,
          year: currentYear,
          month: currentMonth,
          units_kwh: unitsConsumed,
          sanctioned_load_kva: sanctionedLoad,
          timely_payment_opt_in: timelyPaymentOptIn,
          is_lifeline_registered: isLifelineRegistered
        });
      }

      setBillResult(result);
      setHasCalculated(true);
      
      if ('warnings' in result && result.warnings?.fppca_missing) {
        toast({
          title: "Notice",
          description: "FPPCA rate not available for this month. Using default rate of ₹0.00",
          variant: "default"
        });
      } else if ('fppca_missing' in result && result.fppca_missing) {
        toast({
          title: "Notice",
          description: "FPPCA rate not available for this month. Using default rate of ₹0.00",
          variant: "default"
        });
      }

      if ('applied_rules' in result && result.applied_rules.free_units_applied > 0) {
        toast({
          title: "Free Units Applied!",
          description: `${result.applied_rules.free_units_applied} units provided free under government scheme.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setError(error instanceof Error ? error.message : 'Calculation failed');
      toast({
        title: "Calculation Error",
        description: "Failed to calculate bill. Please check your inputs.",
        variant: "destructive"
      });
    } finally {
      setCalculating(false);
    }
  };

  const resetCalculation = () => {
    setBillResult(null);
    setError(null);
    setHasCalculated(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Reset calculation when inputs change
  useEffect(() => {
    if (hasCalculated) {
      resetCalculation();
    }
  }, [selectedProvider, category, unitsConsumed, sanctionedLoad, timelyPaymentOptIn, isLifelineRegistered]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading electricity bill calculator...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Electricity Bill Calculator</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Calculate your electricity bill for CESC and Bihar (NBPCL/SBPCL) with automatic tariff detection and government schemes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Bill Calculation Inputs
            </CardTitle>
            <CardDescription>
              Enter your consumption details for current month electricity bill calculation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Provider Selection */}
            <div>
              <Label htmlFor="provider">Electricity Provider</Label>
              <Select 
                value={selectedProvider?.id || ''} 
                onValueChange={(value) => {
                  const provider = providers.find(p => p.id === value);
                  setSelectedProvider(provider || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} {provider.code ? `(${provider.code})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection - Only show for Bihar providers */}
            {selectedProvider && isBiharProvider(selectedProvider) && (
              <div>
                <Label htmlFor="category">Tariff Category</Label>
                <Select value={category} onValueChange={(value: 'RURAL_DOMESTIC' | 'URBAN_DOMESTIC') => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                placeholder="Enter units from your meter reading"
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
                placeholder="Check your electricity connection details"
              />
            </div>

            {/* Conditional Options */}
            {selectedProvider?.supports_timely_rebate && (
              <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
                <Switch
                  id="timely-payment"
                  checked={timelyPaymentOptIn}
                  onCheckedChange={setTimelyPaymentOptIn}
                />
                <div>
                  <Label htmlFor="timely-payment" className="font-medium">
                    Timely Payment Rebate
                  </Label>
                  <p className="text-sm text-gray-600">
                    Get rebate for paying your bill on time
                  </p>
                </div>
              </div>
            )}

            {selectedProvider?.supports_lifeline && selectedProvider?.lifeline_requires_registration && (
              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                <Switch
                  id="lifeline-registered"
                  checked={isLifelineRegistered}
                  onCheckedChange={setIsLifelineRegistered}
                />
                <div>
                  <Label htmlFor="lifeline-registered" className="font-medium">
                    Lifeline Consumer Registration
                  </Label>
                  <p className="text-sm text-gray-600">
                    Check if you are registered as a lifeline consumer
                  </p>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <Button 
              onClick={handleCalculate} 
              disabled={calculating || !selectedProvider}
              size="lg"
              className="w-full"
            >
              {calculating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Bill
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Show placeholder when no calculation has been done */}
          {!hasCalculated && !error && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Bill Breakdown
                </CardTitle>
                <CardDescription>
                  Enter your details and click "Calculate Bill" to see your electricity bill breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calculator className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Ready to Calculate</p>
                  <p>Fill in your consumption details and click the Calculate Bill button</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bill Breakdown */}
          {(hasCalculated || error) && (
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
                ) : billResult ? (
                  <div className="space-y-4">
                    {/* Applied Rules */}
                    {billResult.applied_rules && (
                      (billResult.applied_rules.lifeline_applied || 
                       billResult.applied_rules.timely_payment_applied ||
                       ('free_units_applied' in billResult.applied_rules && billResult.applied_rules.free_units_applied > 0)) && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Applied Benefits:</h4>
                          <div className="space-y-1 text-sm">
                            {'free_units_applied' in billResult.applied_rules && billResult.applied_rules.free_units_applied > 0 && (
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                {billResult.applied_rules.free_units_applied} units free (Government Scheme)
                              </div>
                            )}
                            {billResult.applied_rules.lifeline_applied && (
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                Lifeline rate applied
                              </div>
                            )}
                            {billResult.applied_rules.timely_payment_applied && (
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                Timely payment rebate applied
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}

                    {/* Bill Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Energy Charges:</span>
                        <span className="font-medium">₹{billResult.breakdown.energy_charge}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fixed Charges:</span>
                        <span className="font-medium">₹{billResult.breakdown.fixed_charge}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">FPPCA Charges:</span>
                        <span className="font-medium">₹{billResult.breakdown.fppca_charge}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Government Duty:</span>
                        <span className="font-medium">₹{billResult.breakdown.duty_charge}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Meter Rent:</span>
                        <span className="font-medium">₹{billResult.breakdown.meter_rent}</span>
                      </div>
                      
                      {Object.entries(billResult.breakdown.rebates || {}).map(([code, amount]) => (
                        <div key={code} className="flex justify-between py-2 border-b">
                          <span className="text-green-600">
                            {code === 'GOVT_FREE_UNITS' ? 'Free Units Rebate' : 
                             code === 'timely_payment' ? 'Timely Payment Rebate' : 
                             code.replace('_', ' ')} Rebate:
                          </span>
                          <span className="font-medium text-green-600">-₹{amount}</span>
                        </div>
                      ))}
                      
                      <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg font-bold">
                        <span>Total Payable Amount:</span>
                        <span className="text-green-600">₹{billResult.total_payable}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Slab-wise Breakdown */}
          {billResult?.slab_wise && billResult.slab_wise.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Slab-wise Energy Charges</CardTitle>
                <CardDescription>
                  Detailed breakdown of energy charges by consumption slabs
                  {'applied_rules' in billResult && billResult.applied_rules.free_units_applied > 0 && 
                    ` (after ${billResult.applied_rules.free_units_applied} free units deduction)`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {'applied_rules' in billResult && billResult.applied_rules.free_units_applied > 0 && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Note:</strong> {billResult.applied_rules.free_units_applied} units were provided free under the government scheme. 
                      The slab calculation below applies to the remaining {billResult.units_kwh - billResult.applied_rules.free_units_applied} billable units.
                    </p>
                  </div>
                )}
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
                      {billResult.slab_wise.map((slab, index) => (
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
      </div>
    </div>
  );
};

export default UnifiedBillCalculator;
