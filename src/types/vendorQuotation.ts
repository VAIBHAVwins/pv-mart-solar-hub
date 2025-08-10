
export interface Component {
  component_type: string;
  brand: string;
  model: string;
  specifications: string;
  quantity: number;
  unit_price: number;
  included_length_meters: number;
  warranty_years: number;
}

export interface VendorQuotationFormData {
  vendor_name: string;
  vendor_phone: string;
  installation_type: string;
  system_type: string;
  installation_charge: string;
  warranty_years: string;
  description: string;
}

export const installationTypes = ['1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', 'custom'];
export const systemTypes = ['on-grid', 'off-grid', 'hybrid'];
export const componentTypes = [
  'solar_panel',
  'inverter',
  'battery',
  'mounting_structure',
  'dc_cable',
  'ac_cable',
  'earthing_kit',
  'lightning_arrestor',
  'mcb',
  'meter',
  'other'
];
