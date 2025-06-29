
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Component, VendorQuotationFormData } from '@/types/vendorQuotation';

export const useVendorQuotationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<VendorQuotationFormData>({
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

  const resetForm = () => {
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

      resetForm();

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

  return {
    formData,
    setFormData,
    components,
    addComponent,
    removeComponent,
    updateComponent,
    calculateTotalPrice,
    handleSubmit,
    loading
  };
};
