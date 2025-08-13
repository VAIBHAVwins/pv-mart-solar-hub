import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, Zap, DollarSign, Trash2, Plus, Save } from 'lucide-react';

interface ElectricityProvider {
  id: string;
  name: string;
  is_active: boolean;
}

interface ProviderConfig {
  id: string;
  provider_id: string;
  fixed_charge_per_kva: number;
  meter_rent: number;
  duty_percentage: number;
  timely_payment_rebate: number;
  lifeline_rate_paise: number;
}

interface TariffSlab {
  id: string;
  provider_id: string;
  min_unit: number;
  max_unit: number | null;
  rate_paise_per_kwh: number;
}

interface FPPCARate {
  id: string;
  provider_id: string;
  year: number;
  month: number;
  rate_per_unit: number;
}

const CESCTariffManager = () => {
  const [providers, setProviders] = useState<ElectricityProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null);
  const [tariffSlabs, setTariffSlabs] = useState<TariffSlab[]>([]);
  const [fppcaRates, setFppcaRates] = useState<FPPCARate[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [newSlabMin, setNewSlabMin] = useState<number>(0);
  const [newSlabMax, setNewSlabMax] = useState<number | null>(null);
  const [newSlabRate, setNewSlabRate] = useState<number>(0);
  const [newFppcaYear, setNewFppcaYear] = useState<number>(new Date().getFullYear());
  const [newFppcaMonth, setNewFppcaMonth] = useState<number>(new Date().getMonth() + 1);
  const [newFppcaRate, setNewFppcaRate] = useState<number>(0);
  
  const { toast } = useToast();

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('electricity_providers')
        .select('*')
        .order('name');

      if (error) throw error;
      setProviders(data || []);
      
      // Auto-select CESC if available
      const cescProvider = data?.find(p => p.name === 'CESC');
      if (cescProvider) {
        setSelectedProvider(cescProvider.id);
      } else if (data && data.length > 0) {
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

  const fetchProviderData = async (providerId: string) => {
    if (!providerId) return;
    
    setLoading(true);
    try {
      // Fetch provider config
      const { data: configData, error: configError } = await supabase
        .from('electricity_provider_config')
        .select('*')
        .eq('provider_id', providerId)
        .single();

      if (configError && configError.code !== 'PGRST116') {
        throw configError;
      }
      setProviderConfig(configData);

      // Fetch tariff slabs
      const { data: slabsData, error: slabsError } = await supabase
        .from('electricity_slabs')
        .select('*')
        .eq('provider_id', providerId)
        .order('min_unit');

      if (slabsError) throw slabsError;
      setTariffSlabs(slabsData || []);

      // Fetch FPPCA rates
      const { data: fppcaData, error: fppcaError } = await supabase
        .from('electricity_fppca_rates')
        .select('*')
        .eq('provider_id', providerId)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (fppcaError) throw fppcaError;
      setFppcaRates(fppcaData || []);

    } catch (error) {
      console.error('Error fetching provider data:', error);
      toast({
        title: "Error",
        description: "Failed to load provider data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProviderConfig = async (updates: Partial<ProviderConfig>) => {
    if (!selectedProvider) return;

    try {
      if (providerConfig) {
        const { error } = await supabase
          .from('electricity_provider_config')
          .update(updates)
          .eq('id', providerConfig.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('electricity_provider_config')
          .insert({
            provider_id: selectedProvider,
            ...updates
          });

        if (error) throw error;
      }

      await fetchProviderData(selectedProvider);
      toast({
        title: "Success",
        description: "Provider configuration updated successfully.",
      });
    } catch (error) {
      console.error('Error updating provider config:', error);
      toast({
        title: "Error",
        description: "Failed to update provider configuration.",
        variant: "destructive"
      });
    }
  };

  const addTariffSlab = async () => {
    if (!selectedProvider || newSlabMin < 0 || newSlabRate <= 0) return;

    try {
      const { error } = await supabase
        .from('electricity_slabs')
        .insert({
          provider_id: selectedProvider,
          min_unit: newSlabMin,
          max_unit: newSlabMax,
          rate_paise_per_kwh: newSlabRate
        });

      if (error) throw error;

      await fetchProviderData(selectedProvider);
      setNewSlabMin(0);
      setNewSlabMax(null);
      setNewSlabRate(0);
      
      toast({
        title: "Success",
        description: "Tariff slab added successfully.",
      });
    } catch (error) {
      console.error('Error adding tariff slab:', error);
      toast({
        title: "Error",
        description: "Failed to add tariff slab.",
        variant: "destructive"
      });
    }
  };

  const deleteTariffSlab = async (slabId: string) => {
    try {
      const { error } = await supabase
        .from('electricity_slabs')
        .delete()
        .eq('id', slabId);

      if (error) throw error;

      await fetchProviderData(selectedProvider);
      toast({
        title: "Success",
        description: "Tariff slab deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting tariff slab:', error);
      toast({
        title: "Error",
        description: "Failed to delete tariff slab.",
        variant: "destructive"
      });
    }
  };

  const addFPPCARate = async () => {
    if (!selectedProvider || newFppcaRate < 0) return;

    try {
      const { error } = await supabase
        .from('electricity_fppca_rates')
        .insert({
          provider_id: selectedProvider,
          year: newFppcaYear,
          month: newFppcaMonth,
          rate_per_unit: newFppcaRate
        });

      if (error) throw error;

      await fetchProviderData(selectedProvider);
      setNewFppcaRate(0);
      
      toast({
        title: "Success",
        description: "MVCA/FPPCA rate added successfully.",
      });
    } catch (error) {
      console.error('Error adding FPPCA rate:', error);
      toast({
        title: "Error",
        description: "Failed to add MVCA/FPPCA rate.",
        variant: "destructive"
      });
    }
  };

  const deleteFPPCARate = async (rateId: string) => {
    try {
      const { error } = await supabase
        .from('electricity_fppca_rates')
        .delete()
        .eq('id', rateId);

      if (error) throw error;

      await fetchProviderData(selectedProvider);
      toast({
        title: "Success",
        description: "MVCA/FPPCA rate deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting FPPCA rate:', error);
      toast({
        title: "Error",
        description: "Failed to delete MVCA/FPPCA rate.",
        variant: "destructive"
      });
    }
  };

  const toggleProviderStatus = async (providerId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('electricity_providers')
        .update({ is_active: isActive })
        .eq('id', providerId);

      if (error) throw error;

      await fetchProviders();
      toast({
        title: "Success",
        description: `Provider ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: "Error",
        description: "Failed to update provider status.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      fetchProviderData(selectedProvider);
    }
  }, [selectedProvider]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">CESC Tariff Manager</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Manage electricity provider settings, tariff slabs, and MVCA/FPPCA rates.
        </p>
      </div>

      {/* Provider Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name} {!provider.is_active && '(Inactive)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedProvider && (
              <div className="flex items-center gap-2">
                <Label htmlFor="provider-active">Active</Label>
                <Switch
                  id="provider-active"
                  checked={providers.find(p => p.id === selectedProvider)?.is_active || false}
                  onCheckedChange={(checked) => toggleProviderStatus(selectedProvider, checked)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedProvider && (
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList>
            <TabsTrigger value="config">Provider Settings</TabsTrigger>
            <TabsTrigger value="slabs">Tariff Slabs</TabsTrigger>
            <TabsTrigger value="fppca">MVCA/FPPCA Rates</TabsTrigger>
          </TabsList>

          {/* Provider Configuration */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Provider Configuration
                </CardTitle>
                <CardDescription>
                  Configure fixed charges, meter rent, duties, and rebates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading configuration...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fixed-charge">Fixed Charge per kVA (₹/month)</Label>
                      <Input
                        id="fixed-charge"
                        type="number"
                        step="0.01"
                        value={providerConfig?.fixed_charge_per_kva || 0}
                        onChange={(e) => updateProviderConfig({ fixed_charge_per_kva: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="meter-rent">Meter Rent (₹/month)</Label>
                      <Input
                        id="meter-rent"
                        type="number"
                        step="0.01"
                        value={providerConfig?.meter_rent || 0}
                        onChange={(e) => updateProviderConfig({ meter_rent: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="duty-percentage">Government Duty (%)</Label>
                      <Input
                        id="duty-percentage"
                        type="number"
                        step="0.01"
                        value={providerConfig?.duty_percentage || 0}
                        onChange={(e) => updateProviderConfig({ duty_percentage: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="timely-rebate">Timely Payment Rebate (%)</Label>
                      <Input
                        id="timely-rebate"
                        type="number"
                        step="0.01"
                        value={providerConfig?.timely_payment_rebate || 0}
                        onChange={(e) => updateProviderConfig({ timely_payment_rebate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tariff Slabs */}
          <TabsContent value="slabs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Tariff Slabs
                </CardTitle>
                <CardDescription>
                  Manage energy charge slabs and rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add New Slab */}
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="font-semibold mb-4">Add New Slab</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label htmlFor="slab-min">Min Unit</Label>
                      <Input
                        id="slab-min"
                        type="number"
                        value={newSlabMin}
                        onChange={(e) => setNewSlabMin(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slab-max">Max Unit (empty for unlimited)</Label>
                      <Input
                        id="slab-max"
                        type="number"
                        value={newSlabMax || ''}
                        onChange={(e) => setNewSlabMax(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slab-rate">Rate (paisa/kWh)</Label>
                      <Input
                        id="slab-rate"
                        type="number"
                        value={newSlabRate}
                        onChange={(e) => setNewSlabRate(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <Button onClick={addTariffSlab} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Slab
                    </Button>
                  </div>
                </div>

                {/* Existing Slabs */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Min Unit</TableHead>
                      <TableHead>Max Unit</TableHead>
                      <TableHead>Rate (paisa/kWh)</TableHead>
                      <TableHead>Rate (₹/kWh)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tariffSlabs.map((slab) => (
                      <TableRow key={slab.id}>
                        <TableCell>{slab.min_unit}</TableCell>
                        <TableCell>{slab.max_unit || '∞'}</TableCell>
                        <TableCell>{slab.rate_paise_per_kwh}</TableCell>
                        <TableCell>₹{(slab.rate_paise_per_kwh / 100).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTariffSlab(slab.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FPPCA Rates */}
          <TabsContent value="fppca">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  MVCA/FPPCA Rates
                </CardTitle>
                <CardDescription>
                  Manage monthly variable cost adjustment rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add New Rate */}
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="font-semibold mb-4">Add New MVCA/FPPCA Rate</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label htmlFor="fppca-year">Year</Label>
                      <Select value={newFppcaYear.toString()} onValueChange={(value) => setNewFppcaYear(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2022, 2023, 2024, 2025, 2026].map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fppca-month">Month</Label>
                      <Select value={newFppcaMonth.toString()} onValueChange={(value) => setNewFppcaMonth(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month.value} value={month.value.toString()}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fppca-rate">Rate (₹/kWh)</Label>
                      <Input
                        id="fppca-rate"
                        type="number"
                        step="0.0001"
                        value={newFppcaRate}
                        onChange={(e) => setNewFppcaRate(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button onClick={addFPPCARate} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Rate
                    </Button>
                  </div>
                </div>

                {/* Existing Rates */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Rate (₹/kWh)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fppcaRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell>{rate.year}</TableCell>
                        <TableCell>{months.find(m => m.value === rate.month)?.label}</TableCell>
                        <TableCell>₹{rate.rate_per_unit.toFixed(4)}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteFPPCARate(rate.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CESCTariffManager;
