
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

interface Component {
  component_type: string;
  brand: string;
  model: string;
  specifications: string;
  quantity: number;
  unit_price: number;
  included_length_meters?: number;
  warranty_years?: number;
}

export default function SupabaseQuotationForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_phone: '',
    installation_type: '',
    system_type: '',
    installation_charge: '',
    warranty_years: '',
    description: ''
  });

  const [components, setComponents] = useState<Component[]>([{
    component_type: '',
    brand: '',
    model: '',
    specifications: '',
    quantity: 1,
    unit_price: 0,
    included_length_meters: undefined,
    warranty_years: undefined
  }]);

  const installationTypes = ['1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', 'custom'];
  const systemTypes = ['on-grid', 'off-grid', 'hybrid'];
  const componentTypes = [
    'solar_panel', 'inverter', 'battery', 'cable_ac', 'cable_dc', 
    'mounting_structure', 'earthing', 'lightning_arrestor', 'mc4_connector', 
    'junction_box', 'other'
  ];

  const addComponent = () => {
    setComponents([...components, {
      component_type: '',
      brand: '',
      model: '',
      specifications: '',
      quantity: 1,
      unit_price: 0,
      included_length_meters: undefined,
      warranty_years: undefined
    }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: string, value: any) => {
    const updated = [...components];
    updated[index] = { ...updated[index], [field]: value };
    setComponents(updated);
  };

  const calculateTotalPrice = () => {
    const componentsTotal = components.reduce((sum, comp) => sum + (comp.unit_price * comp.quantity), 0);
    const installationCharge = parseFloat(formData.installation_charge) || 0;
    return componentsTotal + installationCharge;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Insert quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('vendor_quotations')
        .insert([{
          vendor_id: user.uid,
          vendor_name: formData.vendor_name,
          vendor_email: user.email!,
          vendor_phone: formData.vendor_phone,
          installation_type: formData.installation_type as any,
          system_type: formData.system_type as any,
          total_price: calculateTotalPrice(),
          installation_charge: parseFloat(formData.installation_charge) || null,
          warranty_years: parseInt(formData.warranty_years) || null,
          description: formData.description
        }])
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Insert components
      const componentInserts = components.map(comp => ({
        quotation_id: quotation.id,
        component_type: comp.component_type as any,
        brand: comp.brand,
        model: comp.model,
        specifications: comp.specifications,
        quantity: comp.quantity,
        unit_price: comp.unit_price,
        total_price: comp.unit_price * comp.quantity,
        included_length_meters: comp.included_length_meters,
        warranty_years: comp.warranty_years
      }));

      const { error: componentsError } = await supabase
        .from('quotation_components')
        .insert(componentInserts);

      if (componentsError) throw componentsError;

      toast({
        title: "Success!",
        description: "Quotation submitted successfully.",
      });

      // Reset form
      setFormData({
        vendor_name: '',
        vendor_phone: '',
        installation_type: '',
        system_type: '',
        installation_charge: '',
        warranty_years: '',
        description: ''
      });
      setComponents([{
        component_type: '',
        brand: '',
        model: '',
        specifications: '',
        quantity: 1,
        unit_price: 0,
        included_length_meters: undefined,
        warranty_years: undefined
      }]);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit quotation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#797a83] to-[#4f4f56] py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-[#f7f7f6] shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#797a83] text-center">
                Supabase Vendor Quotation Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor_name">Vendor Name *</Label>
                    <Input
                      id="vendor_name"
                      value={formData.vendor_name}
                      onChange={(e) => setFormData({...formData, vendor_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendor_phone">Phone Number</Label>
                    <Input
                      id="vendor_phone"
                      value={formData.vendor_phone}
                      onChange={(e) => setFormData({...formData, vendor_phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="installation_type">Installation Type *</Label>
                    <Select value={formData.installation_type} onValueChange={(value) => setFormData({...formData, installation_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select installation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {installationTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="system_type">System Type *</Label>
                    <Select value={formData.system_type} onValueChange={(value) => setFormData({...formData, system_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system type" />
                      </SelectTrigger>
                      <SelectContent>
                        {systemTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="installation_charge">Installation Charge (₹)</Label>
                    <Input
                      id="installation_charge"
                      type="number"
                      value={formData.installation_charge}
                      onChange={(e) => setFormData({...formData, installation_charge: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="warranty_years">Warranty (Years)</Label>
                    <Input
                      id="warranty_years"
                      type="number"
                      value={formData.warranty_years}
                      onChange={(e) => setFormData({...formData, warranty_years: e.target.value})}
                    />
                  </div>
                </div>

                {/* Components Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#797a83]">Components</h3>
                    <Button type="button" onClick={addComponent} className="bg-[#b07e66] hover:bg-[#797a83]">
                      <Plus className="w-4 h-4 mr-2" /> Add Component
                    </Button>
                  </div>
                  
                  {components.map((component, index) => (
                    <Card key={index} className="border-[#b07e66]">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label>Component Type *</Label>
                            <Select value={component.component_type} onValueChange={(value) => updateComponent(index, 'component_type', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select component" />
                              </SelectTrigger>
                              <SelectContent>
                                {componentTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Brand *</Label>
                            <Input
                              value={component.brand}
                              onChange={(e) => updateComponent(index, 'brand', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label>Model</Label>
                            <Input
                              value={component.model}
                              onChange={(e) => updateComponent(index, 'model', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              value={component.quantity}
                              onChange={(e) => updateComponent(index, 'quantity', parseInt(e.target.value))}
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <Label>Unit Price (₹) *</Label>
                            <Input
                              type="number"
                              value={component.unit_price}
                              onChange={(e) => updateComponent(index, 'unit_price', parseFloat(e.target.value))}
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div>
                            <Label>Length (meters)</Label>
                            <Input
                              type="number"
                              value={component.included_length_meters || ''}
                              onChange={(e) => updateComponent(index, 'included_length_meters', e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </div>
                          <div>
                            <Label>Warranty (Years)</Label>
                            <Input
                              type="number"
                              value={component.warranty_years || ''}
                              onChange={(e) => updateComponent(index, 'warranty_years', e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label>Specifications</Label>
                          <Textarea
                            value={component.specifications}
                            onChange={(e) => updateComponent(index, 'specifications', e.target.value)}
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#797a83]">
                            Total: ₹{(component.unit_price * component.quantity).toFixed(2)}
                          </span>
                          {components.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeComponent(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-[#797a83] mb-4">
                    Total Quotation: ₹{calculateTotalPrice().toFixed(2)}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#b07e66] hover:bg-[#797a83] px-8 py-2"
                  >
                    {loading ? 'Submitting...' : 'Submit Quotation'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
