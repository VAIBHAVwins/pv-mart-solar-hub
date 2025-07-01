
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Customer Requirements Management
export const customerRequirementsService = {
  // Get all customer requirements
  async getAll() {
    const { data, error } = await supabase
      .from('customer_requirements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get customer requirement by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('customer_requirements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new customer requirement
  async create(requirement: TablesInsert<'customer_requirements'>) {
    const { data, error } = await supabase
      .from('customer_requirements')
      .insert(requirement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update customer requirement
  async update(id: string, updates: TablesUpdate<'customer_requirements'>) {
    const { data, error } = await supabase
      .from('customer_requirements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete customer requirement
  async delete(id: string) {
    const { error } = await supabase
      .from('customer_requirements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Vendor Quotations Management
export const vendorQuotationsService = {
  // Get all vendor quotations
  async getAll() {
    const { data, error } = await supabase
      .from('vendor_quotations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get vendor quotation by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('vendor_quotations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new vendor quotation
  async create(quotation: TablesInsert<'vendor_quotations'>) {
    const { data, error } = await supabase
      .from('vendor_quotations')
      .insert(quotation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update vendor quotation
  async update(id: string, updates: TablesUpdate<'vendor_quotations'>) {
    const { data, error } = await supabase
      .from('vendor_quotations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete vendor quotation
  async delete(id: string) {
    const { error } = await supabase
      .from('vendor_quotations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Quotation Components Management
export const quotationComponentsService = {
  // Get components for a quotation
  async getByQuotationId(quotationId: string) {
    const { data, error } = await supabase
      .from('quotation_components')
      .select('*')
      .eq('quotation_id', quotationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Create new quotation component
  async create(component: TablesInsert<'quotation_components'>) {
    const { data, error } = await supabase
      .from('quotation_components')
      .insert(component)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update quotation component
  async update(id: string, updates: TablesUpdate<'quotation_components'>) {
    const { data, error } = await supabase
      .from('quotation_components')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete quotation component
  async delete(id: string) {
    const { error } = await supabase
      .from('quotation_components')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
