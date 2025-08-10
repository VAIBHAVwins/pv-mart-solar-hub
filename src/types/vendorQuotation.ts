
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
