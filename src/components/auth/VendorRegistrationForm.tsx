
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validation, sanitize, validationMessages } from '@/lib/validation';

interface VendorRegistrationFormProps {
  onOTPRequired: (phone: string) => void;
  onBack: () => void;
}

export function VendorRegistrationForm({ onOTPRequired, onBack }: VendorRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contactPersonName: '',
    companyName: '',
    companyAddress: '',
    phone: '',
    email: '',
    gstNumber: '',
    password: '',
    confirmPassword: '',
    pmSuryaGharRegistered: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    if (name === 'phone') {
      sanitizedValue = sanitize.phone(value);
    } else if (name === 'gstNumber') {
      sanitizedValue = sanitize.gstNumber(value);
    } else {
      sanitizedValue = sanitize.text(value);
    }
    
    if (!validation.noScriptTags(sanitizedValue)) {
      return;
    }

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    if (error) setError('');
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, pmSuryaGharRegistered: checked }));
  };

  const validateForm = () => {
    const requiredFields = ['contactPersonName', 'companyName', 'companyAddress', 'phone', 'email', 'gstNumber', 'password', 'confirmPassword'];
    
    for (const field of requiredFields) {
      if (!validation.required(formData[field as keyof typeof formData] as string)) {
        setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return false;
      }
    }

    if (!validation.phone(formData.phone)) {
      setError(validationMessages.phone);
      return false;
    }

    if (!validation.email(formData.email)) {
      setError(validationMessages.email);
      return false;
    }

    if (!validation.gstNumber(formData.gstNumber)) {
      setError(validationMessages.gstNumber);
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhone(formData.phone);

      // Check if user already exists with this email or phone
      const { data: existingUser } = await supabase
        .from('users')
        .select('email, phone, role')
        .or(`email.eq.${formData.email},phone.eq.${normalizedPhone}`)
        .maybeSingle();

      if (existingUser) {
        if (existingUser.email === formData.email) {
          setError('An account with this email already exists');
        } else if (existingUser.phone === normalizedPhone) {
          setError('An account with this phone number already exists');
        }
        return;
      }

      // Create user account with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/vendor/dashboard`,
          data: {
            full_name: formData.contactPersonName,
            phone: normalizedPhone,
            role: 'vendor',
            contact_person: formData.contactPersonName,
            company_name: formData.companyName,
            company_address: formData.companyAddress,
            gst_number: formData.gstNumber,
            pm_surya_ghar_registered: formData.pmSuryaGharRegistered
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // Send OTP using Twilio via edge function
        const { data: otpResponse, error: otpError } = await supabase.functions.invoke('send-otp', {
          body: {
            phone: normalizedPhone,
            userType: 'vendor'
          }
        });

        if (otpError) {
          setError('Failed to send OTP. Please try again.');
          return;
        }

        toast({
          title: "Registration Initiated",
          description: "Please verify your phone number with the OTP sent to your mobile."
        });

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Vendor Registration</CardTitle>
        <CardDescription>
          Register your business to provide solar solutions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person Name *
              </label>
              <Input
                id="contactPersonName"
                name="contactPersonName"
                type="text"
                placeholder="Enter contact person name"
                value={formData.contactPersonName}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="h-12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Company Address *
            </label>
            <Textarea
              id="companyAddress"
              name="companyAddress"
              placeholder="Enter complete company address"
              value={formData.companyAddress}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div>
            <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
              GST Number *
            </label>
            <Input
              id="gstNumber"
              name="gstNumber"
              type="text"
              placeholder="22AAAAA0000A1Z5"
              value={formData.gstNumber}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="h-12"
              maxLength={15}
            />
            <p className="text-xs text-gray-500 mt-1">
              15-character GST number (Required)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">+91</span>
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
                  className="pl-12 h-12"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password (min 8 characters)"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="h-12"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Switch
                id="pmSuryaGhar"
                checked={formData.pmSuryaGharRegistered}
                onCheckedChange={handleSwitchChange}
                disabled={loading}
              />
              <label htmlFor="pmSuryaGhar" className="text-sm font-medium text-gray-700">
                I am a PM Surya Ghar Yojna registered vendor
              </label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            Back to Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
