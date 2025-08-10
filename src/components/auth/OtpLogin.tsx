
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OtpLoginProps {
  userType?: 'customer' | 'vendor';
  onSuccess?: () => void;
}

const OtpLogin = ({ userType = 'customer', onSuccess }: OtpLoginProps) => {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizePhone = (phoneNumber: string) => {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If starts with country code, return as is with +
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return '+' + cleaned;
    }
    
    // If 10 digits, assume Indian number
    if (cleaned.length === 10) {
      return '+91' + cleaned;
    }
    
    return phoneNumber.startsWith('+') ? phoneNumber : '+91' + cleaned;
  };

  const sendOtp = async () => {
    if (!phone.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhone(phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
        options: {
          data: { user_type: userType }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setStep('otp');
        setError('');
      }
    } catch (err: any) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhone(phone);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Success - redirect to dashboard
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = `/${userType}/dashboard`;
        }
      }
    } catch (err: any) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers and limit length
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
  };

  if (step === 'otp') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Verify Your Phone</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to +91{phone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('phone')}
              className="w-full"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Phone Number
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle>Phone Login</CardTitle>
        <CardDescription>
          Enter your phone number to receive a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="9876543210"
                className="pl-12"
                maxLength={10}
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              We'll send you a verification code via SMS
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={sendOtp}
            disabled={loading || phone.length < 10}
            className="w-full"
          >
            {loading ? 'Sending OTP...' : 'Send Verification Code'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OtpLogin;
