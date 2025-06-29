
export interface CustomerRequirementFormData {
  customer_name: string;
  customer_phone: string;
  installation_type: string;
  system_type: string;
  property_type: string;
  roof_type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  monthly_bill: string;
  timeline: string;
  budget_range: string;
  additional_requirements: string;
}

export const installationTypes = ['1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', 'custom'];
export const systemTypes = ['on-grid', 'off-grid', 'hybrid'];
export const propertyTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural'];
export const roofTypes = ['RCC Flat', 'Tin Shed', 'Tile Roof', 'Asbestos', 'Ground Mount'];
export const timelines = ['Within 1 month', '1-3 months', '3-6 months', '6+ months'];
export const budgetRanges = ['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', '₹5,00,000+'];
