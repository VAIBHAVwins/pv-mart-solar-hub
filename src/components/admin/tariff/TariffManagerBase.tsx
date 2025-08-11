
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface Provider {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  supports_lifeline: boolean;
  lifeline_threshold_units: number;
  lifeline_requires_registration: boolean;
  supports_timely_rebate: boolean;
  meter_rent: number;
  fixed_charge_per_kva: number;
  government_duty_percent: number;
}

interface TariffVersion {
  id: string;
  provider_id: string;
  code: string;
  category: string;
  effective_from: string;
  is_active: boolean;
  description: string;
}

interface TariffSlab {
  id: string;
  tariff_version_id: string;
  min_unit: number;
  max_unit: number | null;
  rate_per_unit: number;
  position: number;
}

interface TariffManagerBaseProps {
  providerCode: string;
  title: string;
  description: string;
}

const TariffManagerBase: React.FC<TariffManagerBaseProps> = ({ 
  providerCode, 
  title, 
  description 
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [tariffVersions, setTariffVersions] = useState<TariffVersion[]>([]);
  const [tariffSlabs, setTariffSlabs] = useState<TariffSlab[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedTariffVersion, setSelectedTariffVersion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('code', providerCode)
        .order('name');

      if (error) throw error;
      setProviders(data || []);
      
      if (data && data.length > 0 && !selectedProvider) {
        setSelectedProvider(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers.",
        variant: "destructive"
      });
    }
  };

  const fetchTariffVersions = async () => {
    if (!selectedProvider) return;
    
    try {
      const { data, error } = await supabase
        .from('tariff_versions')
        .select('*')
        .eq('provider_id', selectedProvider)
        .order('effective_from', { ascending: false });

      if (error) throw error;
      setTariffVersions(data || []);
      
      if (data && data.length > 0 && !selectedTariffVersion) {
        setSelectedTariffVersion(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching tariff versions:', error);
      toast({
        title: "Error",
        description: "Failed to load tariff versions.",
        variant: "destructive"
      });
    }
  };

  const fetchTariffSlabs = async () => {
    if (!selectedTariffVersion) return;
    
    try {
      const { data, error } = await supabase
        .from('tariff_slabs')
        .select('*')
        .eq('tariff_version_id', selectedTariffVersion)
        .order('position');

      if (error) throw error;
      setTariffSlabs(data || []);
    } catch (error) {
      console.error('Error fetching tariff slabs:', error);
      toast({
        title: "Error",
        description: "Failed to load tariff slabs.",
        variant: "destructive"
      });
    }
  };

  const updateProvider = async (provider: Provider) => {
    try {
      const { error } = await supabase
        .from('providers')
        .update({
          name: provider.name,
          is_active: provider.is_active,
          supports_lifeline: provider.supports_lifeline,
          lifeline_threshold_units: provider.lifeline_threshold_units,
          lifeline_requires_registration: provider.lifeline_requires_registration,
          supports_timely_rebate: provider.supports_timely_rebate,
          meter_rent: provider.meter_rent,
          fixed_charge_per_kva: provider.fixed_charge_per_kva,
          government_duty_percent: provider.government_duty_percent
        })
        .eq('id', provider.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Provider updated successfully.",
      });
      
      fetchProviders();
    } catch (error) {
      console.error('Error updating provider:', error);
      toast({
        title: "Error",
        description: "Failed to update provider.",
        variant: "destructive"
      });
    }
  };

  const updateTariffSlab = async (slab: TariffSlab) => {
    try {
      const { error } = await supabase
        .from('tariff_slabs')
        .update({
          min_unit: slab.min_unit,
          max_unit: slab.max_unit,
          rate_per_unit: slab.rate_per_unit,
          position: slab.position
        })
        .eq('id', slab.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Tariff slab updated successfully.",
      });
      
      fetchTariffSlabs();
    } catch (error) {
      console.error('Error updating tariff slab:', error);
      toast({
        title: "Error",
        description: "Failed to update tariff slab.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    fetchTariffVersions();
  }, [selectedProvider]);

  useEffect(() => {
    fetchTariffSlabs();
  }, [selectedTariffVersion]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tariff manager...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedProviderData = providers.find(p => p.id === selectedProvider);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="providers">Provider Settings</TabsTrigger>
          <TabsTrigger value="tariffs">Tariff Slabs</TabsTrigger>
          <TabsTrigger value="fppca">FPPCA Rates</TabsTrigger>
          <TabsTrigger value="rebates">Rebate Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Provider Configuration</CardTitle>
              <CardDescription>
                Manage provider settings and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProviderData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="provider-name">Provider Name</Label>
                        <Input
                          id="provider-name"
                          value={selectedProviderData.name}
                          onChange={(e) => {
                            const updated = { ...selectedProviderData, name: e.target.value };
                            setProviders(providers.map(p => p.id === updated.id ? updated : p));
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="fixed-charge">Fixed Charge per kVA (₹)</Label>
                        <Input
                          id="fixed-charge"
                          type="number"
                          step="0.01"
                          value={selectedProviderData.fixed_charge_per_kva}
                          onChange={(e) => {
                            const updated = { ...selectedProviderData, fixed_charge_per_kva: parseFloat(e.target.value) || 0 };
                            setProviders(providers.map(p => p.id === updated.id ? updated : p));
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="meter-rent">Meter Rent (₹)</Label>
                        <Input
                          id="meter-rent"
                          type="number"
                          step="0.01"
                          value={selectedProviderData.meter_rent}
                          onChange={(e) => {
                            const updated = { ...selectedProviderData, meter_rent: parseFloat(e.target.value) || 0 };
                            setProviders(providers.map(p => p.id === updated.id ? updated : p));
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="duty-percent">Government Duty (%)</Label>
                        <Input
                          id="duty-percent"
                          type="number"
                          step="0.01"
                          value={selectedProviderData.government_duty_percent}
                          onChange={(e) => {
                            const updated = { ...selectedProviderData, government_duty_percent: parseFloat(e.target.value) || 0 };
                            setProviders(providers.map(p => p.id === updated.id ? updated : p));
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-active"
                          checked={selectedProviderData.is_active}
                          onCheckedChange={(checked) => {
                            const updated = { ...selectedProviderData, is_active: checked };
                            setProviders(providers.map(p => p.id === updated.id ? updated : p));
                          }}
                        />
                        <Label htmlFor="is-active">Active Provider</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="supports-lifeline"
                          checked={selectedProviderData.supports_lifeline}
                          onCheckedChange={(checked) => {
                            const updated = { ...selectedProviderData, supports_lifeline: checked };
                            setProviders(providers.map(p => p.id === updated.id ? updated : p));
                          }}
                        />
                        <Label htmlFor="supports-lifeline">Supports Lifeline</Label>
                      </div>

                      {selectedProviderData.supports_lifeline && (
                        <>
                          <div>
                            <Label htmlFor="lifeline-threshold">Lifeline Threshold (units)</Label>
                            <Input
                              id="lifeline-threshold"
                              type="number"
                              value={selectedProviderData.lifeline_threshold_units}
                              onChange={(e) => {
                                const updated = { ...selectedProviderData, lifeline_threshold_units: parseInt(e.target.value) || 0 };
                                setProviders(providers.map(p => p.id === updated.id ? updated : p));
                              }}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="lifeline-registration"
                              checked={selectedProviderData.lifeline_requires_registration}
                              onCheckedChange={(checked) => {
                                const updated = { ...selectedProviderData, lifeline_requires_registration: checked };
                                setProviders(providers.map(p => p.id === updated.id ? updated : p));
                              }}
                            />
                            <Label htmlFor="lifeline-registration">Requires Lifeline Registration</Label>
                          </div>
                        </>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="supports-timely"
                          checked={selectedProviderData.supports_timely_rebate}
                          onCheckedChange={(checked) => {
                            const updated = { ...selectedProviderData, supports_timely_rebate: checked };
                            setProviders(providers.map(p => p.id === updated.id ? updated : p));
                          }}
                        />
                        <Label htmlFor="supports-timely">Supports Timely Payment Rebate</Label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => updateProvider(selectedProviderData)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Provider Settings
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tariffs">
          <Card>
            <CardHeader>
              <CardTitle>Tariff Slabs Management</CardTitle>
              <CardDescription>
                Manage energy consumption slabs and rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="tariff-version-select">Tariff Version</Label>
                  <Select value={selectedTariffVersion} onValueChange={setSelectedTariffVersion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tariff version" />
                    </SelectTrigger>
                    <SelectContent>
                      {tariffVersions.map(version => (
                        <SelectItem key={version.id} value={version.id}>
                          {version.category} - {version.code}
                          {version.is_active && <Badge className="ml-2">Active</Badge>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {tariffSlabs.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Min Unit</TableHead>
                        <TableHead>Max Unit</TableHead>
                        <TableHead>Rate (₹/kWh)</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tariffSlabs.map((slab) => (
                        <TableRow key={slab.id}>
                          <TableCell>
                            <Input
                              type="number"
                              value={slab.min_unit}
                              onChange={(e) => {
                                const updated = { ...slab, min_unit: parseInt(e.target.value) || 0 };
                                setTariffSlabs(tariffSlabs.map(s => s.id === updated.id ? updated : s));
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={slab.max_unit || ''}
                              placeholder="∞"
                              onChange={(e) => {
                                const value = e.target.value;
                                const updated = { ...slab, max_unit: value ? parseInt(value) : null };
                                setTariffSlabs(tariffSlabs.map(s => s.id === updated.id ? updated : s));
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={slab.rate_per_unit}
                              onChange={(e) => {
                                const updated = { ...slab, rate_per_unit: parseFloat(e.target.value) || 0 };
                                setTariffSlabs(tariffSlabs.map(s => s.id === updated.id ? updated : s));
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={slab.position}
                              onChange={(e) => {
                                const updated = { ...slab, position: parseInt(e.target.value) || 0 };
                                setTariffSlabs(tariffSlabs.map(s => s.id === updated.id ? updated : s));
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => updateTariffSlab(slab)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fppca">
          <Card>
            <CardHeader>
              <CardTitle>FPPCA Rates Management</CardTitle>
              <CardDescription>
                Manage monthly FPPCA rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">FPPCA rates management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rebates">
          <Card>
            <CardHeader>
              <CardTitle>Rebate Rules Management</CardTitle>
              <CardDescription>
                Manage rebate and subsidy rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Rebate rules management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TariffManagerBase;
