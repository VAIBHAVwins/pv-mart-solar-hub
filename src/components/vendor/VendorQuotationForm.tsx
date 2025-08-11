
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateQuotationId } from '@/lib/id-generators';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface ComponentData {
  id: string;
  componentType: string;
  componentName: string;
  brand: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warrantyYears: number;
}

interface QuotationFormData {
  quotationId: string;
  bundleCapacity: number;
  installationType: 'on_grid' | 'off_grid' | 'hybrid';
  usageType: 'residential' | 'commercial' | 'industrial';
  biDirectionalMeter: boolean;
  biDirectionalMeterPrice: number;
  subsidyAssistance: boolean;
  installationCharge: number;
  description: string;
  warrantyYears: number;
}

const solarPanelBrands = [
  'Adani Solar', 'Tata Power Solar', 'Waaree', 'Vikram Solar', 'RenewSys', 
  'Luminous', 'Microtek', 'UTL Solar', 'Goldi Solar', 'Other'
];

const inverterBrands = [
  'Sungrow', 'Fronius', 'SMA', 'Microtek', 'Luminous', 'Delta', 
  'ABB', 'Schneider Electric', 'Huawei', 'Other'
];

const VendorQuotationForm: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [formData, setFormData] = useState<QuotationFormData>({
    quotationId: '',
    bundleCapacity: 1,
    installationType: 'on_grid',
    usageType: 'residential',
    biDirectionalMeter: false,
    biDirectionalMeterPrice: 0,
    subsidyAssistance: false,
    installationCharge: 0,
    description: '',
    warrantyYears: 5
  });

  const [components, setComponents] = useState<ComponentData[]>([
    {
      id: '1',
      componentType: 'solar_panel',
      componentName: 'Solar Panel',
      brand: '',
      specification: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      warrantyYears: 25
    },
    {
      id: '2',
      componentType: 'inverter',
      componentName: 'Inverter',
      brand: '',
      specification: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      warrantyYears: 5
    },
    {
      id: '3',
      componentType: 'mounting',
      componentName: 'Mounting Structure',
      brand: '',
      specification: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      warrantyYears: 25
    }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      quotationId: generateQuotationId()
    }));
  }, []);

  const updateComponent = (id: string, field: keyof ComponentData, value: any) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === id) {
        const updated = { ...comp, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return comp;
    }));
  };

  const addComponent = () => {
    const newComponent: ComponentData = {
      id: Date.now().toString(),
      componentType: 'additional',
      componentName: '',
      brand: '',
      specification: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      warrantyYears: 1
    };
    setComponents(prev => [...prev, newComponent]);
  };

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  };

  const calculateTotalPrice = () => {
    const componentsTotal = components.reduce((sum, comp) => sum + comp.totalPrice, 0);
    const biMeterPrice = formData.biDirectionalMeter ? formData.biDirectionalMeterPrice : 0;
    return componentsTotal + formData.installationCharge + biMeterPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to submit a quotation');
      return;
    }

    setLoading(true);
    try {
      // Validate required fields
      const requiredComponents = components.filter(comp => 
        comp.componentName && comp.quantity > 0 && comp.unitPrice > 0
      );

      if (requiredComponents.length === 0) {
        toast.error('Please add at least one component with valid details');
        setLoading(false);
        return;
      }

      // Get user profile for vendor details
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, email, phone, company_name')
        .eq('id', user.id)
        .single();

      if (!profile) {
        toast.error('Vendor profile not found');
        setLoading(false);
        return;
      }

      const totalPrice = calculateTotalPrice();

      // For now, use existing table structure with mapped values
      const { data: quotation, error: quotationError } = await supabase
        .from('vendor_quotations')
        .insert({
          vendor_id: user.id,
          vendor_name: profile.company_name || profile.full_name || '',
          vendor_email: profile.email || '',
          vendor_phone: profile.phone || '',
          system_type: formData.installationType as any, // Map to existing enum
          installation_type: 'rooftop' as any, // Default value for existing schema
          total_price: totalPrice,
          installation_charge: formData.installationCharge,
          description: formData.description,
          warranty_years: formData.warrantyYears
        })
        .select()
        .single();

      if (quotationError) {
        console.error('Quotation error:', quotationError);
        throw quotationError;
      }

      // Insert components using existing table
      const componentInserts = requiredComponents.map(comp => ({
        quotation_id: quotation.id,
        component_type: comp.componentType,
        specifications: comp.specification,
        brand: comp.brand,
        model: comp.componentName,
        quantity: comp.quantity,
        unit_price: comp.unitPrice,
        total_price: comp.totalPrice,
        warranty_years: comp.warrantyYears
      }));

      const { error: componentsError } = await supabase
        .from('quotation_components')
        .insert(componentInserts);

      if (componentsError) {
        console.error('Components error:', componentsError);
        throw componentsError;
      }

      toast.success(`Quotation ${formData.quotationId} submitted successfully!`);
      
      // Reset form
      setFormData({
        quotationId: generateQuotationId(),
        bundleCapacity: 1,
        installationType: 'on_grid',
        usageType: 'residential',
        biDirectionalMeter: false,
        biDirectionalMeterPrice: 0,
        subsidyAssistance: false,
        installationCharge: 0,
        description: '',
        warrantyYears: 5
      });

      setComponents([
        {
          id: '1',
          componentType: 'solar_panel',
          componentName: 'Solar Panel',
          brand: '',
          specification: '',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
          warrantyYears: 25
        },
        {
          id: '2',
          componentType: 'inverter',
          componentName: 'Inverter',
          brand: '',
          specification: '',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
          warrantyYears: 5
        },
        {
          id: '3',
          componentType: 'mounting',
          componentName: 'Mounting Structure',
          brand: '',
          specification: '',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
          warrantyYears: 25
        }
      ]);

    } catch (error) {
      console.error('Error submitting quotation:', error);
      toast.error('Failed to submit quotation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBrandOptions = (componentType: string) => {
    switch (componentType) {
      case 'solar_panel':
        return solarPanelBrands;
      case 'inverter':
        return inverterBrands;
      default:
        return ['Other'];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="text-2xl">
              Quotation ID: {formData.quotationId}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bundle Information */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Bundle Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bundleCapacity">Bundle Capacity (kW)</Label>
                    <Input
                      id="bundleCapacity"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.bundleCapacity}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bundleCapacity: parseFloat(e.target.value) || 0
                      }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="installationType">Installation Type</Label>
                    <Select 
                      value={formData.installationType} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        installationType: value as 'on_grid' | 'off_grid' | 'hybrid'
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on_grid">On-Grid</SelectItem>
                        <SelectItem value="off_grid">Off-Grid</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="usageType">Usage Type</Label>
                    <Select 
                      value={formData.usageType} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        usageType: value as 'residential' | 'commercial' | 'industrial'
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="warrantyYears">Overall Warranty (Years)</Label>
                    <Input
                      id="warrantyYears"
                      type="number"
                      min="1"
                      value={formData.warrantyYears}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        warrantyYears: parseInt(e.target.value) || 1
                      }))}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="biDirectionalMeter"
                      checked={formData.biDirectionalMeter}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        biDirectionalMeter: checked as boolean
                      }))}
                    />
                    <Label htmlFor="biDirectionalMeter">Bi-Directional Meter Included</Label>
                  </div>

                  {formData.biDirectionalMeter && (
                    <div>
                      <Label htmlFor="biMeterPrice">Bi-Directional Meter Price (₹)</Label>
                      <Input
                        id="biMeterPrice"
                        type="number"
                        min="0"
                        value={formData.biDirectionalMeterPrice}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          biDirectionalMeterPrice: parseFloat(e.target.value) || 0
                        }))}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subsidyAssistance"
                      checked={formData.subsidyAssistance}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        subsidyAssistance: checked as boolean
                      }))}
                    />
                    <Label htmlFor="subsidyAssistance">Subsidy Assistance Provided</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Components */}
              <Card className="bg-gray-50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">System Components</CardTitle>
                  <Button type="button" onClick={addComponent} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Component
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {components.map((component) => (
                    <Card key={component.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label>Component Name</Label>
                          <Input
                            value={component.componentName}
                            onChange={(e) => updateComponent(component.id, 'componentName', e.target.value)}
                            placeholder="e.g., Solar Panel"
                            required
                          />
                        </div>

                        <div>
                          <Label>Brand</Label>
                          <Select 
                            value={component.brand}
                            onValueChange={(value) => updateComponent(component.id, 'brand', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {getBrandOptions(component.componentType).map(brand => (
                                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Specification</Label>
                          <Input
                            value={component.specification}
                            onChange={(e) => updateComponent(component.id, 'specification', e.target.value)}
                            placeholder="Technical details"
                          />
                        </div>

                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={component.quantity}
                            onChange={(e) => updateComponent(component.id, 'quantity', parseInt(e.target.value) || 1)}
                            required
                          />
                        </div>

                        <div>
                          <Label>Unit Price (₹)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={component.unitPrice}
                            onChange={(e) => updateComponent(component.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            required
                          />
                        </div>

                        <div>
                          <Label>Total Price (₹)</Label>
                          <Input
                            type="number"
                            value={component.totalPrice}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>

                        <div>
                          <Label>Warranty (Years)</Label>
                          <Input
                            type="number"
                            min="1"
                            value={component.warrantyYears}
                            onChange={(e) => updateComponent(component.id, 'warrantyYears', parseInt(e.target.value) || 1)}
                            required
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeComponent(component.id)}
                            disabled={components.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Installation & Other Charges */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Installation & Other Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="installationCharge">Installation Service Charge (₹)</Label>
                    <Input
                      id="installationCharge"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.installationCharge}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        installationCharge: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Additional Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      placeholder="Any additional information or special conditions..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Total */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-center">
                    Total Bundle Price: ₹{calculateTotalPrice().toLocaleString('en-IN')}
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Submitting...' : 'Submit Quotation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorQuotationForm;
