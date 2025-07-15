
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { RegistrationFormFields } from './RegistrationFormFields';
import { RegistrationMessages } from './RegistrationMessages';
import { supabase } from '@/integrations/supabase/client';

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  onSuccess: (email: string) => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { signUp } = useSupabaseAuth();
  const [form, setForm] = useState<RegistrationFormData>({ 
    name: '', 
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
    } else if (name === 'name') {
      // Allow spaces anywhere, do not trim
      sanitizedValue = value.slice(0, 1000); // Only limit length
    } else {
      sanitizedValue = sanitize.text(value);
    }
    
    if (!validation.noScriptTags(sanitizedValue)) {
      return;
    }
    
    setForm({ ...form, [name]: sanitizedValue });
    if (error) setError('');
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    for (const field of requiredFields) {
      if (!validation.required((form as any)[field])) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    if (!validation.maxLength((form as any).name, 100)) {
      setError(validationMessages.maxLength(100));
      return false;
    }

    if (!validation.email((form as any).email)) {
      setError(validationMessages.email);
      return false;
    }

    if (!validation.phone((form as any).phone)) {
      setError(validationMessages.phone);
      return false;
    }

    if (!validation.password((form as any).password)) {
      setError(validationMessages.password);
      return false;
    }

    if ((form as any).password !== (form as any).confirmPassword) {
      setError(validationMessages.noMatch);
      return false;
    }

    return true;
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
      // Check if email is already used in customers or vendors
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', form.email)
        .single();
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('email', form.email)
        .single();
      if (customer || vendor) {
        setError('This email is already registered as a ' + (customer ? 'customer' : 'vendor') + '. Please use a different email.');
        setLoading(false);
        return;
      }
      console.log('Attempting customer registration with:', { 
        email: form.email, 
        name: form.name,
        phone: form.phone 
      });
      
      const { data, error } = await signUp(form.email, form.password, {
        data: {
          full_name: sanitize.html(form.name),
          phone: sanitize.html(form.phone),
          user_type: 'customer'
        }
      });
      
      console.log('Customer signup response:', { data, error });
      
      if (error) {
        console.error('Customer signup error:', error);
        
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
      } else {
        console.log('Customer registered successfully:', data.user?.id);
        setSuccess('Account created successfully! Please verify your email with OTP.');
        onSuccess(form.email);
      }
    } catch (err: any) {
      console.error('Customer registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#190a02] mb-2">Customer Registration</h1>
        <p className="text-[#8b4a08]">Create your account to access solar solutions</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <RegistrationMessages error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <RegistrationFormFields
          form={form}
          loading={loading}
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="w-full bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] font-semibold"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#8b4a08] mb-2">
          Already have an account?{' '}
          <a href="/customer/login" className="text-[#0895c6] hover:underline font-semibold">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
