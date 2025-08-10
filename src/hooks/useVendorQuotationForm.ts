
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Component, VendorQuotationFormData } from '@/types/vendorQuotation';

export const useVendorQuotationForm = () => {
  const { user } = useSupabaseAuth();

  const [formData, setFormData] = useState<VendorQuotationFormData>({
    vendor_name: '',
    vendor_phone: '',
    installation_type: '',
    system_type: '',
    installation_charge: '',
    warranty_years: '1',
    description: '',
  });

  const [components, setComponents] = useState<Component[]>([
    {
      component_type: '',
      brand: '',
      model: '',
      specifications: '',
      quantity: 1,
      unit_price: 0,
      included_length_meters: 0,
      warranty_years: 1,
    }
  ]);

  const [loading, setLoading] = useState(false);

  const addComponent = () => {
    setComponents([...components, {
      component_type: '',
      brand: '',
      model: '',
      specifications: '',
      quantity: 1,
      unit_price: 0,
      included_length_meters: 0,
      warranty_years: 1,
    }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: keyof Component, value: string | number) => {
    const updatedComponents = [...components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    setComponents(updatedComponents);
  };

  const calculateTotalPrice = () => {
    const componentsTotal = components.reduce((sum, comp) => sum + (comp.quantity * comp.unit_price), 0);
    const installationCharge = parseFloat(formData.installation_charge) || 0;
    return componentsTotal + installationCharge;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      // First, insert the main quotation
      const quotationData = {
        vendor_id: user.id,
        vendor_name: formData.vendor_name,
        vendor_email: user.email || '',
        vendor_phone: formData.vendor_phone,
        installation_type: formData.installation_type as any,
        system_type: formData.system_type as any,
        total_price: calculateTotalPrice(),
        installation_charge: parseFloat(formData.installation_charge) || 0,
        warranty_years: parseInt(formData.warranty_years) || 1,
        description: formData.description,
      };

      const { data: quotation, error: quotationError } = await supabase
        .from('vendor_quotations')
        .insert(quotationData)
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Then insert all components
      if (quotation && components.length > 0) {
        const componentData = components.map(comp => ({
          quotation_id: quotation.id,
          component_type: comp.component_type,
          brand: comp.brand,
          model: comp.model,
          specifications: comp.specifications,
          quantity: comp.quantity,
          unit_price: comp.unit_price,
          included_length_meters: comp.included_length_meters,
          warranty_years: comp.warranty_years,
        }));

        const { error: componentsError } = await supabase
          .from('quotation_components')
          .insert(componentData);

        if (componentsError) throw componentsError;
      }

      // Reset form
      setFormData({
        vendor_name: '',
        vendor_phone: '',
        installation_type: '',
        system_type: '',
        installation_charge: '',
        warranty_years: '1',
        description: '',
      });
      setComponents([{
        component_type: '',
        brand: '',
        model: '',
        specifications: '',
        quantity: 1,
        unit_price: 0,
        included_length_meters: 0,
        warranty_years: 1,
      }]);

      alert('Quotation submitted successfully!');

    } catch (err: any) {
      console.error('Error submitting quotation:', err);
      alert('Failed to submit quotation: ' + err.message);
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
    loading,
  };
};
