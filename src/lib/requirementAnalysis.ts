
import { supabase } from '@/integrations/supabase/client';

// Simple analysis function without complex types
export const analyzeRequirement = async (formData: any) => {
  try {
    // Simple panel calculation based on monthly bill
    const monthlyBill = parseFloat(formData.monthly_bill) || 0;
    const estimatedPanelCount = Math.ceil(monthlyBill / 100);
    
    return {
      panelCount: estimatedPanelCount,
      message: `Based on your monthly bill of ₹${monthlyBill}, we recommend approximately ${estimatedPanelCount} solar panels.`
    };
  } catch (error) {
    console.error('Error analyzing requirement:', error);
    return {
      panelCount: 0,
      message: 'Unable to analyze requirement at this time.'
    };
  }
};
