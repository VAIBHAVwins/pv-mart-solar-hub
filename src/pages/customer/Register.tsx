import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OTPVerification } from '@/components/auth/OTPVerification';

export default function CustomerRegister() {
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Sanitize input based on field type
    if (name === 'phone') {
      sanitizedValue = sanitize.phone(value);
    } else {
      sanitizedValue = sanitize.text(value);
    }
    
    // Prevent script injection
    if (!validation.noScriptTags(sanitizedValue)) {
      return;
    }
    
    setForm({ ...form, [name]: sanitizedValue });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!validation.required(form.name)) {
      setError('Name is required');
      return false;
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
      console.log('Attempting to sign up with:', { email: form.email, name: form.name });
      
      const { data, error } = await signUp(form.email, form.password, {
        data: {
          full_name: sanitize.html(form.name),
          user_type: 'customer'
        }
      });
      
      if (error) {
        console.error('SignUp error:', error);
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please login instead.');
        } else {
          setError(`Registration failed: ${error.message}`);
        }
      } else {
        // Create profile with phone number
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              full_name: sanitize.html(form.name),
              phone: sanitize.html(form.phone),
              user_type: 'customer'
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        setSuccess('Account created successfully! Please verify your email with OTP.');
        setRegisteredEmail(form.email);
        setShowOTP(true);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    navigate('/customer/dashboard');
  };

  const handleBackToRegistration = () => {
    setShowOTP(false);
    setRegisteredEmail('');
    setSuccess('');
  };

  if (showOTP) {
    return (
      <Layout className="bg-gradient-to-br from-[#fecb00] to-[#f8b200] min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <OTPVerification
            email={registeredEmail}
            onVerificationComplete={handleVerificationComplete}
            onBack={handleBackToRegistration}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-gradient-to-br from-[#fecb00] to-[#f8b200] min-h-screen">
      <div className="container mx-auto px-4 py-16">
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

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-[#190a02]">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-[#190a02]">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-[#190a02]">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Enter your phone number"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#190a02]">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Create a password"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#190a02]">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

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
      </div>
    </Layout>
  );
}
