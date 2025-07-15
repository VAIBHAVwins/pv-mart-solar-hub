import { createClient } from '@supabase/supabase-js';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://lkalcafckgyilasikfml.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWxjYWZja2d5aWxhc2lrZm1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIyNTM5MywiZXhwIjoyMDY2ODAxMzkzfQ.dzvT7IwJq4FSscdQ-brXe1e-SDY6CKvZvkaDol-xscM";

// Admin client with service role key for database operations
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Customer Requirements Management
export const customerRequirementsService = {
  // Get all customer requirements
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('customer_requirements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get customer requirement by ID
  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('customer_requirements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new customer requirement
  async create(requirement: TablesInsert<'customer_requirements'>) {
    const { data, error } = await supabaseAdmin
      .from('customer_requirements')
      .insert(requirement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update customer requirement
  async update(id: string, updates: TablesUpdate<'customer_requirements'>) {
    const { data, error } = await supabaseAdmin
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
    const { error } = await supabaseAdmin
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
    const { data, error } = await supabaseAdmin
      .from('vendor_quotations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get vendor quotation by ID
  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('vendor_quotations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new vendor quotation
  async create(quotation: TablesInsert<'vendor_quotations'>) {
    const { data, error } = await supabaseAdmin
      .from('vendor_quotations')
      .insert(quotation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update vendor quotation
  async update(id: string, updates: TablesUpdate<'vendor_quotations'>) {
    const { data, error } = await supabaseAdmin
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
    const { error } = await supabaseAdmin
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
    const { data, error } = await supabaseAdmin
      .from('quotation_components')
      .select('*')
      .eq('quotation_id', quotationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Create new quotation component
  async create(component: TablesInsert<'quotation_components'>) {
    const { data, error } = await supabaseAdmin
      .from('quotation_components')
      .insert(component)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update quotation component
  async update(id: string, updates: TablesUpdate<'quotation_components'>) {
    const { data, error } = await supabaseAdmin
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
    const { error } = await supabaseAdmin
      .from('quotation_components')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Utility: Delete customer accounts for emails that are registered as both customer and vendor
export const deleteDuplicateCustomerAccounts = async () => {
  console.log('🔍 Finding duplicate emails registered as both customer and vendor...');
  // 1. Get all vendor emails
  const { data: vendorProfiles, error: vendorError } = await supabaseAdmin
    .from('profiles')
    .select('user_id, user_type, full_name, company_name, phone')
    .eq('user_type', 'vendor');
  if (vendorError) throw vendorError;
  const vendorEmails = new Set((vendorProfiles || []).map((v: any) => v.email));

  // 2. Get all customer profiles with those emails
  const { data: customerProfiles, error: customerError } = await supabaseAdmin
    .from('profiles')
    .select('user_id, user_type, email')
    .eq('user_type', 'customer');
  if (customerError) throw customerError;

  const duplicates = (customerProfiles || []).filter((c: any) => vendorEmails.has(c.email));
  if (duplicates.length === 0) {
    console.log('✅ No duplicate customer accounts found.');
    return { deleted: 0 };
  }

  // 3. Delete customer accounts for those emails
  let deleted = 0;
  for (const dup of duplicates) {
    // Delete from auth.users
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(dup.user_id);
      if (authError) {
        console.error(`❌ Failed to delete customer user_id ${dup.user_id}:`, authError);
      } else {
        console.log(`🗑️ Deleted customer user_id ${dup.user_id} (email: ${dup.email})`);
        deleted++;
      }
    } catch (err) {
      console.error(`❌ Exception deleting user_id ${dup.user_id}:`, err);
    }
  }
  console.log(`🎉 Deleted ${deleted} duplicate customer accounts.`);
  return { deleted };
};
