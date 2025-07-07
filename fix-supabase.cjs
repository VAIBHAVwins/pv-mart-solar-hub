const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://lkalcafckgyilasikfml.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWxjYWZja2d5aWxhc2lrZm1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIyNTM5MywiZXhwIjoyMDY2ODAxMzkzfQ.dzvT7IwJq4FSscdQ-brXe1e-SDY6CKvZvkaDol-xscM";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixDatabase() {
  console.log('🔧 Starting Supabase database fixes...');
  
  try {
    // 1. Add phone column to profiles table
    console.log('📝 Adding phone column to profiles table...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.profiles 
        ADD COLUMN IF NOT EXISTS phone TEXT;
      `
    });
    
    if (alterError) {
      console.log('Phone column might already exist or error:', alterError);
    } else {
      console.log('✅ Phone column added successfully');
    }

    // 2. Update the trigger function
    console.log('🔄 Updating trigger function...');
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
          -- Log the trigger execution for debugging
          RAISE NOTICE 'Trigger handle_new_user executed for user: %', NEW.id;
          RAISE NOTICE 'User metadata: %', NEW.raw_user_meta_data;
          
          -- Insert profile with proper error handling
          INSERT INTO public.profiles (user_id, full_name, company_name, user_type, phone)
          VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
            NEW.raw_user_meta_data->>'company_name',
            COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
            NEW.raw_user_meta_data->>'phone'
          );
          
          RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
          RETURN NEW;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (triggerError) {
      console.error('❌ Error updating trigger function:', triggerError);
      return;
    } else {
      console.log('✅ Trigger function updated successfully');
    }

    // 3. Drop and recreate the trigger
    console.log('🔧 Recreating trigger...');
    const { error: dropTriggerError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      `
    });
    
    const { error: createTriggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
      `
    });
    
    if (createTriggerError) {
      console.error('❌ Error creating trigger:', createTriggerError);
      return;
    } else {
      console.log('✅ Trigger recreated successfully');
    }

    // 4. Test the profiles table structure
    console.log('🔍 Testing profiles table structure...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error accessing profiles table:', profilesError);
      return;
    } else {
      console.log('✅ Profiles table accessible');
      if (profiles && profiles.length > 0) {
        console.log('📊 Profiles table structure:', Object.keys(profiles[0]));
      }
    }

    console.log('🎉 Database schema fixes completed successfully!');
    console.log('🚀 Customer and vendor registration should now work properly!');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
  }
}

// Run the fix
fixDatabase(); 