import { supabase } from '@/integrations/supabase/client';
import { CustomerRequirementFormData } from '@/types/customerRequirement';

/**
 * Analyzes the customer requirement and vendor quotations to estimate the number of solar panels required.
 * @param requirement The customer requirement form data
 * @returns {Promise<{ panelCount: number, bestQuotation?: any }>} The estimated panel count and best matching vendor quotation
 */
export async function analyzeRequirement(requirement: CustomerRequirementFormData) {
  // Fetch vendor quotations matching the system type and installation type
  const { data: quotations, error } = await supabase
    .from('vendor_quotations')
    .select('*')
    .eq('system_type', requirement.system_type as any)
    .eq('installation_type', requirement.installation_type as any);

  if (error) throw error;
  if (!quotations || quotations.length === 0) {
    // Fallback: estimate based on monthly bill and system type
    const estimatedPanelCount = estimatePanels(requirement.monthly_bill, requirement.system_type);
    return { panelCount: estimatedPanelCount };
  }

  // Find the best matching quotation (e.g., lowest total price)
  const bestQuotation = quotations.reduce((prev, curr) =>
    prev.total_price < curr.total_price ? prev : curr
  );

  // Estimate panel count based on vendor quotation (if available)
  // For simplicity, assume 1KW = 3 panels, 2KW = 6 panels, etc.
  const kw = parseInt(requirement.installation_type);
  const panelCount = isNaN(kw) ? estimatePanels(requirement.monthly_bill, requirement.system_type) : kw * 3;

  return { panelCount, bestQuotation };
}

function estimatePanels(monthlyBill: string, systemType: string) {
  // Simple estimation: 1 panel = 250W, 1KW = 4 panels
  // Assume average monthly bill = 6 units/day per KW
  const bill = parseFloat(monthlyBill);
  if (isNaN(bill) || bill <= 0) return 3;
  const unitsPerMonth = bill / 8; // Assume Rs. 8/unit
  const kwNeeded = unitsPerMonth / 30 / 4; // 4 units/day per KW
  return Math.max(3, Math.round(kwNeeded * 4)); // 4 panels per KW
} 