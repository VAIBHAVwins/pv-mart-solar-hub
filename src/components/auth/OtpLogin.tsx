
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, MessageCircle } from 'lucide-react';

interface OtpLoginProps {
  role?: 'customer' | 'vendor';
  onSuccess?: () => void;
}

const OtpLogin = ({ role = 'customer', onSuccess }: OtpLoginProps) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const normalizePhone = (phoneNumber: string) => {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it starts with +, return as is
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // If it's a 10-digit number, add +91
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If it starts with 91 and is 12 digits, add +
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const normalizedPhone = normalizePhone(phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
        options: {
          channel: 'sms'
        }
      });

      if (error) {
        throw error;
      }

      setMessage('OTP sent successfully! Please check your phone.');
      setStep('otp');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
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
        throw error;
      }

      if (data.user) {
        setMessage('Login successful!');
        
        // Redirect based on role
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = `/${role}/dashboard`;
        }
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setMessage('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {step === 'phone' ? (
            <Smartphone className="w-8 h-8 text-blue-600" />
          ) : (
            <MessageCircle className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <CardTitle className="text-xl font-bold">
          {step === 'phone' ? 'Login with Phone' : 'Verify OTP'}
        </CardTitle>
        <CardDescription>
          {step === 'phone' 
            ? 'Enter your phone number to receive an OTP'
            : 'Enter the 6-digit code sent to your phone'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {step === 'phone' ? (
          <>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter without country code (e.g., 9876543210)
              </p>
            </div>
            
            <Button 
              onClick={handleSendOtp}
              disabled={loading || !phone.trim()}
              className="w-full"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium mb-2">
                Enter OTP
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                OTP sent to {normalizePhone(phone)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleVerifyOtp}
                disabled={loading || !otp.trim()}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={loading}
                className="w-full"
              >
                Back to Phone Number
              </Button>
            </div>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OtpLogin;
