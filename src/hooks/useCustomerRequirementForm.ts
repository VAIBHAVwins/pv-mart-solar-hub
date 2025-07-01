import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomerRequirementFormData } from '@/types/customerRequirement';
import { useAuth } from '@/contexts/AuthContext';
import { analyzeRequirement } from '@/lib/requirementAnalysis';

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
  const [analysisResult, setAnalysisResult] = useState<null | { panelCount: number; bestQuotation?: any }>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisResult(null);
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a requirement",
        variant: "destructive"
      });
      return;
    }
    if (!formData.customer_name || !formData.installation_type || !formData.system_type || 
        !formData.property_type || !formData.roof_type || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customer_requirements')
        .insert([{ ...formData, customer_id: user.id, customer_email: user.email!, monthly_bill: parseFloat(formData.monthly_bill) || null, installation_type: formData.installation_type as any, system_type: formData.system_type as any }]);
      if (error) throw error;
      // Analyze after storing
      const result = await analyzeRequirement(formData);
      setAnalysisResult(result);
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      toast({
        title: "Success!",
        description: "Your requirement has been submitted and analyzed.",
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
    handleSubmit,
    analysisResult,
    resultRef
  };
};
