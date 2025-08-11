
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, IndianRupee, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  name: string;
  is_active: boolean;
}

interface Slab {
  id: string;
  min_unit: number;
  max_unit: number | null;
  rate_paise_per_kwh: number;
}

interface TariffData {
  slabs: Slab[];
  fixed_charge_per_kva: number;
  meter_rent: number;
  duty_percentage: number;
  timely_payment_rebate: number;
  lifeline_rate_paise: number;
}

const BillCalculator = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [tariffData, setTariffData] = useState<TariffData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Input states
  const [unitsConsumed, setUnitsConsumed] = useState<number>(0);
  const [sanctionedLoad, setSanctionedLoad] = useState<number>(0);
  const [isLifelineConsumer, setIsLifelineConsumer] = useState(false);
  const [fppca, setFppca] = useState<number>(0);
  const [timelyPaymentRebate, setTimelyPaymentRebate] = useState(true);
  
  // Calculation results
  const [billBreakdown, setBillBreakdown] = useState<any>(null);
  
  const { toast } = useToast();

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('electricity_providers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProviders(data || []);
      
      if (data && data.length > 0) {
        setSelectedProvider(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load electricity providers.",
        variant: "destructive"
      });
    }
  };

  const fetchTariffData = async (providerId: string) => {
    try {
      const [slabsResult, configResult] = await Promise.all([
        supabase
          .from('electricity_slabs')
          .select('*')
          .eq('provider_id', providerId)
          .order('min_unit'),
        supabase
          .from('electricity_provider_config')
          .select('*')
          .eq('provider_id', providerId)
          .single()
      ]);

      if (slabsResult.error) throw slabsResult.error;
      if (configResult.error) throw configResult.error;

      setTariffData({
        slabs: slabsResult.data || [],
        fixed_charge_per_kva: configResult.data.fixed_charge_per_kva,
        meter_rent: configResult.data.meter_rent,
        duty_percentage: configResult.data.duty_percentage,
        timely_payment_rebate: configResult.data.timely_payment_rebate,
        lifeline_rate_paise: configResult.data.lifeline_rate_paise
      });
    } catch (error) {
      console.error('Error fetching tariff data:', error);
      toast({
        title: "Error",
        description: "Failed to load tariff data for selected provider.",
        variant: "destructive"
      });
    }
  };

  const calculateBill = () => {
    if (!tariffData) return;
    
    let energyCharges = 0;
    let remainingUnits = unitsConsumed;

    // Handle lifeline consumer (first 25 units at special rate)
    if (isLifelineConsumer && remainingUnits > 0) {
      const lifelineUnits = Math.min(25, remainingUnits);
      energyCharges += (lifelineUnits * tariffData.lifeline_rate_paise) / 100;
      remainingUnits -= lifelineUnits;
    }

    // Calculate energy charges using slabs
    for (const slab of tariffData.slabs) {
      if (remainingUnits <= 0) break;
      
      const slabStart = isLifelineConsumer ? Math.max(0, slab.min_unit - 25) : slab.min_unit;
      const slabEnd = slab.max_unit || Infinity;
      const slabUnits = Math.min(remainingUnits, slabEnd - slabStart + 1);
      
      if (slabUnits > 0) {
        energyCharges += (slabUnits * slab.rate_paise_per_kwh) / 100;
        remainingUnits -= slabUnits;
      }
    }

    // Fixed charges
    const fixedCharges = sanctionedLoad * tariffData.fixed_charge_per_kva;

    // FPPCA charges
    const fppcaCharges = unitsConsumed * fppca;

    // Subtotal before duty
    const subtotalBeforeDuty = energyCharges + fixedCharges + fppcaCharges;

    // Government duty
    const dutyCharges = (subtotalBeforeDuty * tariffData.duty_percentage) / 100;

    // Meter rent
    const meterRent = tariffData.meter_rent;

    // Total before rebate
    const totalBeforeRebate = subtotalBeforeDuty + dutyCharges + meterRent;

    // Rebate calculation (on energy + fixed charges only, excluding duty and meter rent)
    let rebateAmount = 0;
    if (timelyPaymentRebate) {
      rebateAmount = (subtotalBeforeDuty * tariffData.timely_payment_rebate) / 100;
    }

    // Final payable amount
    const finalAmount = totalBeforeRebate - rebateAmount;

    setBillBreakdown({
      energyCharges: energyCharges.toFixed(2),
      fixedCharges: fixedCharges.toFixed(2),
      fppcaCharges: fppcaCharges.toFixed(2),
      dutyCharges: dutyCharges.toFixed(2),
      meterRent: meterRent.toFixed(2),
      rebateAmount: rebateAmount.toFixed(2),
      totalBeforeRebate: totalBeforeRebate.toFixed(2),
      finalAmount: finalAmount.toFixed(2)
    });
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      fetchTariffData(selectedProvider);
    }
  }, [selectedProvider]);

  useEffect(() => {
    setLoading(false);
  }, [tariffData]);

  useEffect(() => {
    if (tariffData && unitsConsumed >= 0 && sanctionedLoad >= 0) {
      calculateBill();
    }
  }, [unitsConsumed, sanctionedLoad, isLifelineConsumer, fppca, timelyPaymentRebate, tariffData]);

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
          Calculate your electricity bill based on your consumption and tariff rates.
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
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* FPPCA */}
            <div>
              <Label htmlFor="fppca">MVCA/FPPCA (₹ per kWh)</Label>
              <Input
                id="fppca"
                type="number"
                min="0"
                step="0.01"
                value={fppca}
                onChange={(e) => setFppca(parseFloat(e.target.value) || 0)}
                placeholder="Enter FPPCA rate"
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
            {billBreakdown ? (
              <div className="space-y-3">
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
    </div>
  );
};

export default BillCalculator;
