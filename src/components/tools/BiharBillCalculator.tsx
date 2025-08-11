
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calculator, IndianRupee, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { computeBiharBill, type BiharBillResult } from '@/lib/billing/computeBiharBill';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Provider {
  id: string;
  code: string;
  name: string;
  supports_lifeline: boolean;
  lifeline_requires_registration: boolean;
  supports_timely_rebate: boolean;
}

const BiharBillCalculator = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  
  // Input states
  const [category, setCategory] = useState<'RURAL_DOMESTIC' | 'URBAN_DOMESTIC'>('RURAL_DOMESTIC');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [unitsConsumed, setUnitsConsumed] = useState<number>(0);
  const [sanctionedLoad, setSanctionedLoad] = useState<number>(1.0);
  const [timelyPaymentOptIn, setTimelyPaymentOptIn] = useState(false);
  const [isLifelineRegistered, setIsLifelineRegistered] = useState(false);
  
  // Results
  const [billResult, setBillResult] = useState<BiharBillResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const categoryOptions = [
    { value: 'RURAL_DOMESTIC', label: 'Rural Domestic' },
    { value: 'URBAN_DOMESTIC', label: 'Urban Domestic' }
  ];

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const providersData = data as Provider[];
      setProviders(providersData);
      
      if (providersData && providersData.length > 0) {
        setSelectedProvider(providersData[0]);
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

  const handleCalculate = async () => {
    if (!selectedProvider) return;

    setCalculating(true);
    setError(null);

    try {
      const result = await computeBiharBill({
        provider_code: selectedProvider.code,
        category,
        year,
        month,
        units_kwh: unitsConsumed,
        sanctioned_load_kva: sanctionedLoad,
        timely_payment_opt_in: timelyPaymentOptIn,
        is_lifeline_registered: isLifelineRegistered
      });

      setBillResult(result);
      
      if (result.warnings?.fppca_missing) {
        toast({
          title: "Notice",
          description: "FPPCA rate not available for this month. Using default rate of ₹0.00",
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

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider && unitsConsumed >= 0 && sanctionedLoad >= 0) {
      handleCalculate();
    }
  }, [selectedProvider, category, year, month, unitsConsumed, sanctionedLoad, timelyPaymentOptIn, isLifelineRegistered]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Bihar bill calculator...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Bihar Electricity Bill Calculator</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Calculate your electricity bill for Bihar (NBPCL/SBPCL) with automatic tariff detection and lifeline eligibility.
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
              Enter your consumption details for Bihar electricity providers.
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
                      {provider.name} ({provider.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
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

            {/* Period Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(yearOption => (
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
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Bill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Bill Breakdown
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your Bihar electricity bill
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
                  {(billResult.applied_rules.lifeline_applied || billResult.applied_rules.timely_payment_applied) && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Applied Benefits:</h4>
                      <div className="space-y-1 text-sm">
                        {billResult.applied_rules.lifeline_applied && (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            Lifeline rate applied (≤50 units)
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
                  )}

                  {/* Warnings */}
                  {billResult.warnings?.fppca_missing && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        FPPCA rate not available for {month}/{year}. Using ₹0.00 per unit.
                      </AlertDescription>
                    </Alert>
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
                    
                    {Object.entries(billResult.breakdown.rebates).map(([code, amount]) => (
                      <div key={code} className="flex justify-between py-2 border-b">
                        <span className="text-green-600">{code.replace('_', ' ')} Rebate:</span>
                        <span className="font-medium text-green-600">-₹{amount}</span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg font-bold">
                      <span>Total Payable Amount:</span>
                      <span className="text-green-600">₹{billResult.total_payable}</span>
                    </div>
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

          {/* Slab-wise Breakdown */}
          {billResult?.slab_wise && billResult.slab_wise.length > 0 && (
            <Card>
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

export default BiharBillCalculator;
