import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface OTPVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export const OTPVerification = ({ email, onVerificationComplete, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use Supabase's built-in email verification
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        setError('Failed to send verification email. Please try again.');
        console.error('OTP send error:', error);
      } else {
        setSuccess('Verification email sent! Please check your inbox and click the verification link.');
      }
      
      setResendDisabled(true);
      setCountdown(60); // 60 seconds cooldown
    } catch (err: any) {
      setError('Failed to send verification email. Please try again.');
      console.error('OTP send error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // For Supabase, we don't need to verify OTP manually
      // The email verification link handles this automatically
      // This is just a fallback for users who might have received an OTP
      setError('Please use the verification link sent to your email instead of entering OTP here.');
    } catch (err: any) {
      setError('Verification failed. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    sendOTP();
  };

  const handleManualVerification = () => {
    // Check if user is already verified
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        setSuccess('Email already verified! Redirecting to dashboard...');
        setTimeout(() => {
          onVerificationComplete();
        }, 2000);
      } else {
        setError('Please check your email and click the verification link.');
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Verify Your Email</CardTitle>
        <p className="text-center text-sm text-gray-600">
          We've sent a verification email to <strong>{email}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {success}
            </div>
          )}
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Please check your email and click the verification link to complete your registration.
            </p>
            
            <Button
              onClick={handleManualVerification}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'I have verified my email'}
            </Button>
            
            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={resendDisabled || loading}
                className="text-sm"
              >
                {resendDisabled 
                  ? `Resend in ${countdown}s` 
                  : 'Resend verification email'
                }
              </Button>
              
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  className="text-sm"
                >
                  Back to Registration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 