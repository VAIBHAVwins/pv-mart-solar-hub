
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface VendorInfo {
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
}

interface SystemDetails {
  installationType: string;
  systemType: string;
  totalPrice: number;
  installationCharge: number;
  warrantyYears: number;
  description: string;
}

interface Component {
  component_name: string;
  brand: string;
  model: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface FormData {
  vendor_name: string;
  vendor_phone: string;
  installation_type: string;
  system_type: string;
  installation_charge: string;
  warranty_years: string;
  description: string;
}

export const useVendorQuotationForm = () => {
  const { user } = useSupabaseAuth();

  const [formData, setFormData] = useState<FormData>({
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
      component_name: '',
      brand: '',
      model: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    }
  ]);

  const [loading, setLoading] = useState(false);

  const addComponent = () => {
    setComponents([...components, {
      component_name: '',
      brand: '',
      model: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: keyof Component, value: string | number) => {
    const updatedComponents = [...components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    
    // Recalculate total price for this component
    if (field === 'quantity' || field === 'unit_price') {
      updatedComponents[index].total_price = 
        updatedComponents[index].quantity * updatedComponents[index].unit_price;
    }
    
    setComponents(updatedComponents);
  };

  const calculateTotalPrice = () => {
    const componentsTotal = components.reduce((sum, comp) => sum + comp.total_price, 0);
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
          component_name: comp.component_name,
          brand: comp.brand,
          model: comp.model,
          quantity: comp.quantity,
          unit_price: comp.unit_price,
          total_price: comp.total_price,
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
        component_name: '',
        brand: '',
        model: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
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
