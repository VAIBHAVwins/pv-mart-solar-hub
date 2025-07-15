
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import VendorRegistrationFormFields from './VendorRegistrationFormFields';
import { supabase } from '@/integrations/supabase/client';

interface VendorRegistrationFormData {
  contactPerson: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function VendorRegistrationForm() {
  const { signUp } = useSupabaseAuth();
  const [formData, setFormData] = useState<VendorRegistrationFormData>({
    contactPerson: '',
    companyName: '',
    email: '',
    phone: '',
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
    } else {
      sanitizedValue = sanitize.text(value);
    }
    
    if (!validation.noScriptTags(sanitizedValue)) {
      return;
    }
    
    setFormData({ ...formData, [name]: sanitizedValue });
    if (error) setError('');
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!validation.required(formData.contactPerson)) {
      setError('Contact person name is required');
      return false;
    }
    
    if (!validation.maxLength(formData.contactPerson, 100)) {
      setError(validationMessages.maxLength(100));
      return false;
    }

    if (!validation.required(formData.companyName)) {
      setError('Company name is required');
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

  const checkEmailExists = async (email: string) => {
    try {
      // Check if email exists in customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (customerError) {
        console.error('Error checking customers table:', customerError);
        throw customerError;
      }

      if (customerData) {
        return { exists: true, role: 'customer' };
      }

      // Check if email exists in vendors table
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (vendorError) {
        console.error('Error checking vendors table:', vendorError);
        throw vendorError;
      }

      if (vendorData) {
        return { exists: true, role: 'vendor' };
      }

      return { exists: false, role: null };
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Checking if email already exists...');
      
      // Check if email already exists in either customers or vendors table
      const emailCheck = await checkEmailExists(formData.email);
      
      if (emailCheck.exists) {
        if (emailCheck.role === 'customer') {
          setError('This email is already registered as a customer. Please use a different email or login to your customer account.');
        } else {
          setError('An account with this email already exists. Please login instead.');
        }
        setLoading(false);
        return;
      }

      console.log('Email is available, proceeding with registration...');
      
      const { data, error } = await signUp(formData.email, formData.password, {
        data: {
          full_name: sanitize.html(formData.contactPerson),
          company_name: sanitize.html(formData.companyName),
          phone: sanitize.html(formData.phone),
          user_type: 'vendor'
        }
      });
      
      console.log('Vendor signup response:', { data, error });
      
      if (error) {
        console.error('Vendor signup error:', error);
        
        // Handle specific error types
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          setError('An account with this email already exists. Please login instead.');
        } else if (error.message.includes('already exists')) {
          setError('Registration failed: Email already exists');
        } else if (error.message.includes('Invalid email') || error.message.includes('invalid email')) {
          setError('Please enter a valid email address.');
        } else if (error.message.includes('Password') || error.message.includes('password')) {
          setError('Password must be at least 6 characters long.');
        } else if (error.message.includes('duplicate key') || error.message.includes('constraint')) {
          setError('Account creation failed. Please try again or contact support if the issue persists.');
        } else if (error.message.includes('Database error') || error.message.includes('database')) {
          setError('Registration temporarily unavailable. Please try again in a few moments.');
        } else {
          setError(`Registration failed: ${error.message}`);
        }
      } else if (data.user) {
        console.log('Vendor registered successfully:', data.user.id);
        
        // Insert vendor record into vendors table
        const { error: insertError } = await supabase
          .from('vendors')
          .insert({
            id: data.user.id,
            email: formData.email,
            company_name: sanitize.html(formData.companyName),
            contact_person: sanitize.html(formData.contactPerson),
            phone: sanitize.html(formData.phone)
          });

        if (insertError) {
          console.error('Error inserting vendor record:', insertError);
          setError('Account created but profile setup failed. Please contact support.');
        } else {
          console.log('Vendor profile created successfully');
          setSuccess('Account created successfully! Please check your email for verification.');
          
          // Reset form
          setFormData({
            contactPerson: '',
            companyName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
        }
      }
    } catch (err: any) {
      console.error('Vendor registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#171a21] mb-2">Vendor Registration</h1>
        <p className="text-[#4f4f56]">Join our network of solar professionals</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <VendorRegistrationFormFields
          formData={formData}
          loading={loading}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
        />

        <Button
          type="submit"
          className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#4f4f56] mb-2">
          Already have an account?{' '}
          <a href="/vendor/login" className="text-[#797a83] hover:underline font-semibold">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
