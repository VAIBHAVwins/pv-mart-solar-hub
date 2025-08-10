
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useVendorQuotationForm = () => {
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    vendorName: '',
    vendorEmail: '',
    vendorPhone: '',
  });

  const [systemDetails, setSystemDetails] = useState<SystemDetails>({
    installationType: '',
    systemType: '',
    totalPrice: 0,
    installationCharge: 0,
    warrantyYears: 1,
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    return componentsTotal + systemDetails.installationCharge;
  };

  const submitQuotation = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // First, insert the main quotation
      const quotationData = {
        vendor_name: vendorInfo.vendorName,
        vendor_email: vendorInfo.vendorEmail,
        vendor_phone: vendorInfo.vendorPhone,
        installation_type: systemDetails.installationType as any,
        system_type: systemDetails.systemType as any,
        total_price: calculateTotalPrice(),
        installation_charge: systemDetails.installationCharge,
        warranty_years: systemDetails.warrantyYears,
        description: systemDetails.description,
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

      setSuccess(true);
      // Reset form
      setVendorInfo({ vendorName: '', vendorEmail: '', vendorPhone: '' });
      setSystemDetails({
        installationType: '',
        systemType: '',
        totalPrice: 0,
        installationCharge: 0,
        warrantyYears: 1,
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

    } catch (err: any) {
      console.error('Error submitting quotation:', err);
      setError(err.message || 'Failed to submit quotation');
    } finally {
      setLoading(false);
    }
  };

  return {
    vendorInfo,
    setVendorInfo,
    systemDetails,
    setSystemDetails,
    components,
    addComponent,
    removeComponent,
    updateComponent,
    calculateTotalPrice,
    submitQuotation,
    loading,
    success,
    error,
  };
};
