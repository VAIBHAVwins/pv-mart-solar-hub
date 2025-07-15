
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://lkalcafckgyilasikfml.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWxjYWZja2d5aWxhc2lrZm1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIyNTM5MywiZXhwIjoyMDY2ODAxMzkzfQ.dzvT7IwJq4FSscdQ-brXe1e-SDY6CKvZvkaDol-xscM";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function cleanupDuplicateVendors() {
  console.log('🧹 Starting cleanup of duplicate vendor accounts...');
  
  try {
    // Get all customer emails
    console.log('📊 Fetching all customer emails...');
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('email');
    
    if (customerError) {
      throw customerError;
    }

    if (!customers || customers.length === 0) {
      console.log('✅ No customers found.');
      return;
    }

    const customerEmails = new Set(customers.map(c => c.email));
    console.log(`📋 Found ${customerEmails.size} customer emails`);

    // Get all vendor emails
    console.log('📊 Fetching all vendor emails...');
    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .select('id, email');
    
    if (vendorError) {
      throw vendorError;
    }

    if (!vendors || vendors.length === 0) {
      console.log('✅ No vendors found.');
      return;
    }

    console.log(`📋 Found ${vendors.length} vendors`);

    // Find duplicate vendor accounts (emails that exist in both customers and vendors)
    const duplicateVendors = vendors.filter(vendor => customerEmails.has(vendor.email));
    
    if (duplicateVendors.length === 0) {
      console.log('✅ No duplicate vendor accounts found. Data is clean!');
      return;
    }

    console.log(`⚠️ Found ${duplicateVendors.length} duplicate vendor accounts to clean up:`);
    duplicateVendors.forEach(vendor => {
      console.log(`   - ${vendor.email} (ID: ${vendor.id})`);
    });

    // Delete duplicate vendor accounts
    let deletedCount = 0;
    for (const vendor of duplicateVendors) {
      try {
        console.log(`🗑️ Deleting duplicate vendor account: ${vendor.email}`);
        
        // Delete from auth.users first (this will cascade to vendors table)
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(vendor.id);
        
        if (authDeleteError) {
          console.log(`⚠️ Could not delete from auth.users for ${vendor.email}: ${authDeleteError.message}`);
          
          // If auth deletion fails, try deleting from vendors table directly
          const { error: vendorDeleteError } = await supabase
            .from('vendors')
            .delete()
            .eq('id', vendor.id);
          
          if (vendorDeleteError) {
            throw vendorDeleteError;
          } else {
            console.log(`✅ Deleted vendor record for: ${vendor.email}`);
            deletedCount++;
          }
        } else {
          console.log(`✅ Deleted auth user and vendor record for: ${vendor.email}`);
          deletedCount++;
        }
      } catch (error) {
        console.error(`❌ Error deleting vendor ${vendor.email}:`, error);
      }
    }

    console.log('\n🎉 Cleanup completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Duplicate vendors found: ${duplicateVendors.length}`);
    console.log(`   - Vendors deleted: ${deletedCount}`);
    console.log(`   - Failed deletions: ${duplicateVendors.length - deletedCount}`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupDuplicateVendors();
