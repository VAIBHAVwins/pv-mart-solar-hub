
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://lkalcafckgyilasikfml.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWxjYWZja2d5aWxhc2lrZm1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIyNTM5MywiZXhwIjoyMDY2ODAxMzkzfQ.dzvT7IwJq4FSscdQ-brXe1e-SDY6CKvZvkaDol-xscM";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateProfilesToCustomersVendors() {
  console.log('🚀 Starting migration from profiles to customers/vendors tables...');
  
  try {
    // Get all profiles with their user_type
    console.log('📊 Fetching all profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name, company_name, phone, user_type, created_at');
    
    if (profilesError) {
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('✅ No profiles found to migrate.');
      return;
    }

    console.log(`📋 Found ${profiles.length} profiles to migrate`);

    // Get emails from auth.users for each user_id
    console.log('📧 Fetching user emails from auth.users...');
    const userIds = profiles.map(p => p.user_id);
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      throw authError;
    }

    // Create a map of user_id to email
    const userEmailMap = {};
    if (authUsers && authUsers.users) {
      authUsers.users.forEach(user => {
        userEmailMap[user.id] = user.email;
      });
    }

    let customersInserted = 0;
    let vendorsInserted = 0;
    let skipped = 0;

    // Process each profile
    for (const profile of profiles) {
      const email = userEmailMap[profile.user_id];
      
      if (!email) {
        console.log(`⚠️ No email found for user_id: ${profile.user_id}, skipping...`);
        skipped++;
        continue;
      }

      try {
        if (profile.user_type === 'customer') {
          // Insert into customers table
          const { error: customerError } = await supabase
            .from('customers')
            .insert({
              id: profile.user_id,
              email: email,
              full_name: profile.full_name,
              phone: profile.phone,
              created_at: profile.created_at
            });

          if (customerError) {
            if (customerError.code === '23505') { // Duplicate key error
              console.log(`🔄 Customer already exists: ${email}`);
            } else {
              throw customerError;
            }
          } else {
            console.log(`✅ Inserted customer: ${email}`);
            customersInserted++;
          }
        } else if (profile.user_type === 'vendor') {
          // Insert into vendors table
          const { error: vendorError } = await supabase
            .from('vendors')
            .insert({
              id: profile.user_id,
              email: email,
              company_name: profile.company_name,
              contact_person: profile.full_name,
              phone: profile.phone,
              created_at: profile.created_at
            });

          if (vendorError) {
            if (vendorError.code === '23505') { // Duplicate key error
              console.log(`🔄 Vendor already exists: ${email}`);
            } else {
              throw vendorError;
            }
          } else {
            console.log(`✅ Inserted vendor: ${email}`);
            vendorsInserted++;
          }
        } else {
          console.log(`⚠️ Unknown user_type '${profile.user_type}' for user: ${email}, treating as customer`);
          
          // Default to customer if user_type is unknown
          const { error: customerError } = await supabase
            .from('customers')
            .insert({
              id: profile.user_id,
              email: email,
              full_name: profile.full_name,
              phone: profile.phone,
              created_at: profile.created_at
            });

          if (customerError) {
            if (customerError.code === '23505') { // Duplicate key error
              console.log(`🔄 Customer already exists: ${email}`);
            } else {
              throw customerError;
            }
          } else {
            console.log(`✅ Inserted customer (default): ${email}`);
            customersInserted++;
          }
        }
      } catch (error) {
        console.error(`❌ Error processing profile for ${email}:`, error);
        skipped++;
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Customers inserted: ${customersInserted}`);
    console.log(`   - Vendors inserted: ${vendorsInserted}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total processed: ${profiles.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateProfilesToCustomersVendors();
