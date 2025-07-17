
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { RegistrationFormFields } from './RegistrationFormFields';
import { RegistrationMessages } from './RegistrationMessages';
import { supabase } from '@/integrations/supabase/client';

interface CustomerRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  onSuccess: (email: string) => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { signUp } = useSupabaseAuth();
  const [formData, setFormData] = useState<CustomerRegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    if (name === 'phone') {
      sanitizedValue = sanitize.phone(value);
    } else if (name === 'pincode') {
      sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    } else if (['address', 'fullName', 'email', 'city', 'state'].includes(name)) {
      sanitizedValue = value.slice(0, 1000);
    } else {
      sanitizedValue = sanitize.text(value);
    }
    
    if (!validation.noScriptTags(sanitizedValue)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const validateForm = () => {
    if (!validation.required(formData.fullName)) {
      setError('Full name is required');
      return false;
    }

    if (!validation.maxLength(formData.fullName, 100)) {
      setError('Full name ' + validationMessages.maxLength(100));
      return false;
    }

    if (!validation.email(formData.email)) {
      setError(validationMessages.email);
      return false;
    }

    if (!validation.phone(formData.phone)) {
      setError(validationMessages.phone);
      return false;
    }

    if (!validation.required(formData.address)) {
      setError('Address is required');
      return false;
    }

    if (!validation.required(formData.city)) {
      setError('City is required');
      return false;
    }

    if (!validation.required(formData.state)) {
      setError('State is required');
      return false;
    }

    if (!validation.required(formData.pincode) || formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }

    if (!validation.password(formData.password)) {
      setError(validationMessages.password);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(validationMessages.noMatch);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // First check if email already exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setError('This email is already registered. Please use a different email.');
        setLoading(false);
        return;
      }

      console.log('🔄 Starting customer registration for:', formData.email);

      // Register with Supabase Auth first
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: signUpError } = await signUp(formData.email, formData.password, {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          role: 'customer',
        }
      });

      if (signUpError) {
        console.error('❌ Supabase Auth signUp failed:', signUpError);
        setError(signUpError.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      if (!authData || !authData.user) {
        console.error('❌ No user data returned from signUp');
        setError('Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      console.log('✅ Supabase Auth user created:', authData.user.id);

      // Now insert into users table with the Auth user's ID
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            role: 'customer',
          }
        ]);

      if (insertError) {
        console.error('❌ Failed to insert into users table:', insertError);
        
        // Clean up the Auth user if database insert fails
        try {
          await supabase.auth.signOut();
        } catch (cleanupError) {
          console.error('❌ Failed to clean up Auth user:', cleanupError);
        }
        
        setError('Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      console.log('✅ User data inserted successfully');
      setSuccess('Registration successful! Please check your email for verification.');
      
      if (onSuccess) {
        onSuccess(formData.email);
      }
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      setError('Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-[#e6d3b3] p-10 rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-[#797a83] drop-shadow">Customer Registration</h1>
      <p className="text-[#4f4f56] mb-8 text-center">Create your account to access solar solutions</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RegistrationFormFields 
          form={formData}
          loading={loading}
          onChange={handleChange}
        />
        <RegistrationMessages error={error} success={success} />
        <Button
          type="submit"
          className="w-full bg-[#797a83] text-white py-3 rounded-lg font-bold hover:bg-[#4f4f56] shadow-md transition"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
