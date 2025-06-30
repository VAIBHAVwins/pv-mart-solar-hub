
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Component, VendorQuotationFormData } from '@/types/vendorQuotation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export const useVendorQuotationForm = () => {
  const { user } = useSupabaseAuth();
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
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a quotation",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.vendor_name || !formData.installation_type || !formData.system_type) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate components
    const validComponents = components.filter(comp => comp.brand && comp.component_type);
    if (validComponents.length === 0) {
      toast({
        title: "No Valid Components",
        description: "Please add at least one component with brand and type",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Submitting quotation with user:', user.id);
      console.log('Form data:', formData);
      
      // Insert quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('vendor_quotations')
        .insert([{
          vendor_id: user.id,
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

      if (quotationError) {
        console.error('Quotation error:', quotationError);
        throw quotationError;
      }

      console.log('Quotation created:', quotation);

      // Insert components
      const componentInserts = validComponents.map(comp => ({
        quotation_id: quotation.id,
        component_type: comp.component_type as any,
        brand: comp.brand,
        model: comp.model || null,
        specifications: comp.specifications || null,
        quantity: comp.quantity,
        unit_price: comp.unit_price,
        total_price: comp.unit_price * comp.quantity,
        included_length_meters: comp.included_length_meters || null,
        warranty_years: comp.warranty_years || null
      }));

      const { error: componentsError } = await supabase
        .from('quotation_components')
        .insert(componentInserts);

      if (componentsError) {
        console.error('Components error:', componentsError);
        throw componentsError;
      }

      toast({
        title: "Success!",
        description: "Quotation submitted successfully.",
      });

      resetForm();

    } catch (error: any) {
      console.error('Full error:', error);
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
