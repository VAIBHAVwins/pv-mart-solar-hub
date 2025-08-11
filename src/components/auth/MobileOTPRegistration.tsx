
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MobileOTPRegistrationProps {
  phone: string;
  userType: 'customer' | 'vendor';
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function MobileOTPRegistration({ 
  phone, 
  userType, 
  onVerificationComplete, 
  onBack 
}: MobileOTPRegistrationProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Sign out any existing session first
      await supabase.auth.signOut();

      const response = await fetch('https://nchxapviawfjtcsvjvfl.supabase.co/functions/v1/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          otp: otp,
          userType: userType
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('OTP verified successfully!');
        setTimeout(() => {
          onVerificationComplete();
        }, 1000);
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://nchxapviawfjtcsvjvfl.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          userType: userType
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('New OTP sent successfully!');
        setCountdown(300);
        setCanResend(false);
        setOtp('');
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {phone}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(value);
              if (error) setError('');
            }}
            maxLength={6}
            disabled={loading}
            className="text-center text-lg tracking-widest"
          />
        </div>

        {countdown > 0 && (
          <div className="text-center text-sm text-gray-500">
            Time remaining: {formatTime(countdown)}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleVerifyOTP}
            disabled={loading || !otp.trim() || otp.length !== 6}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          {canResend && (
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full"
            >
              Resend OTP
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={onBack}
            disabled={loading}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
