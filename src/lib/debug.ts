
import { supabase } from '@/integrations/supabase/client';

export const debugUserProfiles = async () => {
  console.log('🔍 Debugging user profiles...');
  
  try {
    // Check auth users
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    console.log('Auth user:', authUser, 'Error:', authError);
    
    // Check users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    console.log('Users data:', usersData);
    console.log('Users error:', usersError);
    
    return { usersData, usersError };
  } catch (error) {
    console.error('Debug error:', error);
    return { error };
  }
};

export const debugCustomerRegistration = async (email: string) => {
  console.log('🔍 Debugging customer registration for email:', email);
  
  try {
    // Check if user exists in auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find(u => u.email === email);
    console.log('Auth user found:', authUser);
    
    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    
    console.log('User table data:', userData);
    console.log('User table error:', userError);
    
    return { authUser, userData, userError };
  } catch (error) {
    console.error('Debug customer registration error:', error);
    return { error };
  }
};

export const debugVendorRegistration = async (email: string) => {
  console.log('🔍 Debugging vendor registration for email:', email);
  
  try {
    // Check if user exists in auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find(u => u.email === email);
    console.log('Auth user found:', authUser);
    
    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    
    console.log('User table data:', userData);
    console.log('User table error:', userError);
    
    return { authUser, userData, userError };
  } catch (error) {
    console.error('Debug vendor registration error:', error);
    return { error };
  }
};

export const testUserCreation = async () => {
  console.log('🧪 Testing user creation...');
  
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    // Try to create a test user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          role: 'customer'
        }
      }
    });
    
    console.log('Sign up result:', signUpData, 'Error:', signUpError);
    
    // Check if user was created in users table
    if (signUpData.user) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for trigger
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signUpData.user.id);
      
      console.log('User table after creation:', userData, 'Error:', userError);
      
      // Clean up test user
      if (signUpData.user.id) {
        await supabase.auth.admin.deleteUser(signUpData.user.id);
        console.log('Test user cleaned up');
      }
    }
    
    return { signUpData, signUpError };
  } catch (error) {
    console.error('Test user creation error:', error);
    return { error };
  }
};
