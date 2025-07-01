
export interface Quotation {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone?: string;
  installation_type: string;
  system_type: string;
  total_price: number;
  installation_charge?: number;
  warranty_years?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface QuotationComponent {
  id: string;
  quotation_id: string;
  component_type: string;
  brand: string;
  model?: string;
  specifications?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  included_length_meters?: number;
  warranty_years?: number;
  created_at: string;
}

export interface QuotationDetails extends Quotation {
  quotation_components?: QuotationComponent[];
}
