
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CustomerRequirementFormData } from '@/types/customerRequirement';

const initialFormData: CustomerRequirementFormData = {
  customer_name: '',
  customer_phone: '',
  installation_type: '',
  system_type: '',
  property_type: '',
  roof_type: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  monthly_bill: '',
  timeline: '',
  budget_range: '',
  additional_requirements: ''
};

export const useCustomerRequirementForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerRequirementFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('customer_requirements')
        .insert([{
          customer_id: user.uid,
          customer_name: formData.customer_name,
          customer_email: user.email!,
          customer_phone: formData.customer_phone,
          installation_type: formData.installation_type as any,
          system_type: formData.system_type as any,
          property_type: formData.property_type,
          roof_type: formData.roof_type,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          monthly_bill: parseFloat(formData.monthly_bill) || null,
          timeline: formData.timeline,
          budget_range: formData.budget_range,
          additional_requirements: formData.additional_requirements
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your requirement has been submitted successfully. Vendors will contact you soon.",
      });

      setFormData(initialFormData);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit requirement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit
  };
};
