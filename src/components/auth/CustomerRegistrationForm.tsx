
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, Mail, Phone, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { validation, sanitize, validationMessages } from '@/lib/validation';

interface CustomerRegistrationFormProps {
  onOTPRequired: (phone: string) => void;
  onBack: () => void;
}

export function CustomerRegistrationForm({ onOTPRequired, onBack }: CustomerRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    if (error) setError('');
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'phone', 'email', 'password', 'confirmPassword'];
    
    for (const field of requiredFields) {
      if (!validation.required(formData[field as keyof typeof formData])) {
        setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return false;
      }
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

  const normalizePhone = (phone: string) => {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    return phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhone(formData.phone);

      // Check if email or phone already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('email, phone')
        .or(`email.eq.${formData.email},phone.eq.${normalizedPhone}`);

      if (checkError) {
        console.error('Error checking existing users:', checkError);
        setError('Failed to validate user data. Please try again.');
        return;
      }

      if (existingUsers && existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        if (existingUser.email === formData.email) {
          setError('An account with this email already exists');
          return;
        }
        if (existingUser.phone === normalizedPhone) {
          setError('An account with this phone number already exists');
          return;
        }
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/customer/dashboard`,
          data: {
            full_name: formData.fullName,
            phone: normalizedPhone,
            role: 'customer'
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // Send OTP
        const { data: otpResponse, error: otpError } = await supabase.functions.invoke('send-otp', {
          body: {
            phone: normalizedPhone,
            userType: 'customer'
          }
        });

        if (otpError) {
          setError('Failed to send OTP. Please try again.');
          return;
        }

        onOTPRequired(normalizedPhone);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Customer Registration</CardTitle>
        <CardDescription>
          Create your account to access solar solutions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                +91
              </div>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="pl-16"
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={loading}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
