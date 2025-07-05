import { supabase } from '@/integrations/supabase/client';

export const debugCustomerRegistration = async () => {
  console.log('=== Customer Registration Debug ===');
  
  // Test Supabase connection
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Current session:', session);
    console.log('Session error:', error);
  } catch (err) {
    console.error('Error getting session:', err);
  }
  
  // Test profiles table access
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    console.log('Recent profiles:', profiles);
    console.log('Profiles error:', error);
  } catch (err) {
    console.error('Error accessing profiles:', err);
  }
  
  // Test customer_requirements table access
  try {
    const { data: requirements, error } = await supabase
      .from('customer_requirements')
      .select('*')
      .limit(5);
    console.log('Recent customer requirements:', requirements);
    console.log('Requirements error:', error);
  } catch (err) {
    console.error('Error accessing customer_requirements:', err);
  }
  
  console.log('=== End Debug ===');
};

export const testCustomerRegistration = async (testData: {
  email: string;
  password: string;
  name: string;
  phone: string;
}) => {
  console.log('=== Testing Customer Registration ===');
  console.log('Test data:', testData);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testData.email,
      password: testData.password,
      options: {
        data: {
          full_name: testData.name,
          phone: testData.phone,
          user_type: 'customer'
        }
      }
    });
    
    console.log('SignUp result:', { data, error });
    
    if (data.user) {
      console.log('User created with ID:', data.user.id);
      
      // Check if profile was created
      setTimeout(async () => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        console.log('Profile check result:', { profile, profileError });
      }, 2000);
    }
    
  } catch (err) {
    console.error('Test registration error:', err);
  }
  
  console.log('=== End Test ===');
}; 