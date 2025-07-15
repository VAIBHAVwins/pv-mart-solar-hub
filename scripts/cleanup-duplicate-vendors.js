// Standalone script to clean up duplicate vendor accounts (keep customer, delete vendor)
// Usage: node scripts/cleanup-duplicate-vendors.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lkalcafckgyilasikfml.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWxjYWZja2d5aWxhc2lrZm1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIyNTM5MywiZXhwIjoyMDY2ODAxMzkzfQ.dzvT7IwJq4FSscdQ-brXe1e-SDY6CKvZvkaDol-xscM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

(async () => {
  console.log('🔍 Finding duplicate emails registered as both customer and vendor...');
  // 1. Get all customer emails
  const { data: customerProfiles, error: customerError } = await supabase
    .from('profiles')
    .select('email')
    .eq('user_type', 'customer');
  if (customerError) throw customerError;
  const customerEmails = new Set((customerProfiles || []).map((c) => c.email));

  // 2. Get all vendor profiles with those emails
  const { data: vendorProfiles, error: vendorError } = await supabase
    .from('profiles')
    .select('user_id, email')
    .eq('user_type', 'vendor');
  if (vendorError) throw vendorError;

  const duplicates = (vendorProfiles || []).filter((v) => customerEmails.has(v.email));
  if (duplicates.length === 0) {
    console.log('✅ No duplicate vendor accounts found.');
    process.exit(0);
  }

  // 3. Delete vendor accounts for those emails
  let deleted = 0;
  for (const dup of duplicates) {
    // Delete from auth.users
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(dup.user_id);
      if (authError) {
        console.error(`❌ Failed to delete vendor user_id ${dup.user_id}:`, authError);
      } else {
        console.log(`🗑️ Deleted vendor user_id ${dup.user_id} (email: ${dup.email})`);
        deleted++;
      }
    } catch (err) {
      console.error(`❌ Exception deleting user_id ${dup.user_id}:`, err);
    }
  }
  console.log(`🎉 Deleted ${deleted} duplicate vendor accounts.`);
  process.exit(0);
})(); 