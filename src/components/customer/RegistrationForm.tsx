
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { RegistrationFormFields } from './RegistrationFormFields';
import { RegistrationMessages } from './RegistrationMessages';

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
      sanitizedValue = value.slice(0, 1000);
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

    if (!validation.maxLength(form.name, 100)) {
      setError(validationMessages.maxLength(100));
      return false;
    }

    if (!validation.email(form.email)) {
      setError(validationMessages.email);
      return false;
    }

    if (!validation.phone(form.phone)) {
      setError(validationMessages.phone);
      return false;
    }

    if (!validation.password(form.password)) {
      setError(validationMessages.password);
      return false;
    }

    if (form.password !== form.confirmPassword) {
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
      const { data, error: signUpError } = await signUp(form.email, form.password, {
        data: {
          full_name: form.name,
          phone: form.phone,
          role: 'customer'
        }
      });

      if (signUpError) {
        setError(signUpError.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data?.user) {
        setSuccess('Registration successful! Please check your email for verification.');
        onSuccess(form.email);
      }
    } catch (error) {
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
