
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
  
  // Test users table access
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    console.log('Recent users:', users);
    console.log('Users error:', error);
  } catch (err) {
    console.error('Error accessing users:', err);
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
          role: 'customer'
        }
      }
    });
    
    console.log('SignUp result:', { data, error });
    
    if (data.user) {
      console.log('User created with ID:', data.user.id);
      
      // Check if user was created in users table
      setTimeout(async () => {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        console.log('User check result:', { user, userError });
      }, 2000);
    }
    
  } catch (err) {
    console.error('Test registration error:', err);
  }
  
  console.log('=== End Test ===');
}; 
