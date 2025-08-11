
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MobileOTPRegistrationProps {
  phone: string;
  userType: 'customer' | 'vendor';
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function MobileOTPRegistration({ phone, userType, onVerificationComplete, onBack }: MobileOTPRegistrationProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const normalizePhone = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    return phoneNumber;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhone(phone);
      
      // Verify OTP using the database function
      const { data, error: verifyError } = await supabase.rpc('verify_mobile_otp', {
        phone_number: normalizedPhone,
        otp_code: otp,
        user_type: userType
      });

      if (verifyError) {
        throw verifyError;
      }

      if (data) {
        toast({
          title: "Verification Successful",
          description: "Your mobile number has been verified successfully!"
        });
        onVerificationComplete();
      } else {
        setError('Invalid or expired OTP. Please check the code and try again.');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhone(phone);
      
      // Send new OTP using the database function
      const { data: otpCode, error: sendError } = await supabase.rpc('send_mobile_otp', {
        phone_number: normalizedPhone,
        user_type: userType
      });

      if (sendError) {
        throw sendError;
      }

      // For demo purposes, show the OTP (in production, this would be sent via SMS)
      console.log(`New OTP for ${normalizedPhone}: ${otpCode}`);
      alert(`Demo Mode: Your new OTP is ${otpCode}`);

      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your phone."
      });

      // Reset timer
      setTimeLeft(600);
      setCanResend(false);
      setOtp('');
    } catch (err: any) {
      console.error('OTP resend error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle>Verify Your Phone Number</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {phone}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                if (error) setError('');
              }}
              placeholder="000000"
              className="text-center text-2xl tracking-widest font-mono h-12"
              maxLength={6}
              required
              disabled={loading}
            />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {timeLeft > 0 ? (
                  <>Time remaining: {formatTime(timeLeft)}</>
                ) : (
                  <span className="text-red-600">OTP expired</span>
                )}
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading || otp.length !== 6 || timeLeft === 0}
              className="w-full h-12"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Code</span>
                </div>
              )}
            </Button>

            {canResend && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="w-full"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="w-full"
            >
              Back to Registration
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
