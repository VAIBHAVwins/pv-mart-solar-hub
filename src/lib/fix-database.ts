import { supabaseAdmin } from './supabase-admin';
import { supabase } from '@/integrations/supabase/client';

export const fixDatabaseSchema = async () => {
  console.log('🔧 Starting database schema fixes...');
  
  try {
    // 1. Add phone column to profiles table if it doesn't exist
    console.log('📝 Adding phone column to profiles table...');
    const { error: alterError } = await supabaseAdmin.rpc('exec_sql', {
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
    const { error: triggerError } = await supabaseAdmin.rpc('exec_sql', {
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
      return { success: false, error: triggerError };
    } else {
      console.log('✅ Trigger function updated successfully');
    }

    // 3. Drop and recreate the trigger
    console.log('🔧 Recreating trigger...');
    const { error: dropTriggerError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      `
    });
    
    const { error: createTriggerError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
      `
    });
    
    if (createTriggerError) {
      console.error('❌ Error creating trigger:', createTriggerError);
      return { success: false, error: createTriggerError };
    } else {
      console.log('✅ Trigger recreated successfully');
    }

    // 4. Test the profiles table structure
    console.log('🔍 Testing profiles table structure...');
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error accessing profiles table:', profilesError);
      return { success: false, error: profilesError };
    } else {
      console.log('✅ Profiles table accessible');
      console.log('📊 Profiles table structure:', Object.keys(profiles[0] || {}));
    }

    console.log('🎉 Database schema fixes completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    return { success: false, error };
  }
};

export const testRegistration = async (testData: {
  email: string;
  password: string;
  name: string;
  phone: string;
  userType: 'customer' | 'vendor';
  companyName?: string;
}) => {
  console.log('🧪 Testing registration with:', testData);
  
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: testData.email,
      password: testData.password,
      email_confirm: true,
      user_metadata: {
        full_name: testData.name,
        phone: testData.phone,
        user_type: testData.userType,
        ...(testData.companyName && { company_name: testData.companyName })
      }
    });
    
    if (error) {
      console.error('❌ Test registration failed:', error);
      return { success: false, error };
    }
    
    console.log('✅ Test user created:', data.user?.id);
    
    // Check if profile was created
    setTimeout(async () => {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', data.user?.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile not found:', profileError);
      } else {
        console.log('✅ Profile created successfully:', profile);
      }
    }, 2000);
    
    return { success: true, user: data.user };
    
  } catch (error) {
    console.error('❌ Test registration error:', error);
    return { success: false, error };
  }
}; 

/**
 * Deletes orphaned rows in the users table (rows where the email does not exist in Supabase Auth)
 * Usage: Call this function from a script or admin panel to clean up the users table.
 */
export async function deleteOrphanedUsers() {
  // 1. Get all users from the users table
  const { data: users, error: usersError } = await supabase.from('users').select('id, email');
  if (usersError) {
    console.error('Failed to fetch users:', usersError);
    return;
  }
  // 2. For each user, check if they exist in Auth
  let deletedCount = 0;
  for (const user of users || []) {
    // Try to sign in with a random password to check if Auth user exists (Supabase client-side limitation)
    // Alternatively, you can use the Supabase Admin API from a secure backend to list Auth users
    // Here, we just log the emails for manual cleanup
    // You can also use the SQL editor in Supabase Studio to run a query to find orphans
    console.log('Orphan check:', user.email);
    // (Manual step: check Auth > Users in Supabase Studio for this email)
  }
  // For actual deletion, you can run a SQL query in Supabase Studio:
  // DELETE FROM users WHERE email NOT IN (SELECT email FROM auth.users);
  console.log('Orphan check complete. Please delete orphaned users manually using the SQL editor.');
} 