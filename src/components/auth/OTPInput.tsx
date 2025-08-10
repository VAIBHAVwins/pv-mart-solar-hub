
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, ArrowLeft, Shield } from 'lucide-react';

interface OTPInputProps {
  phoneNumber: string;
  onVerifyOTP: (otp: string) => void;
  onBackToPhone: () => void;
  loading?: boolean;
  error?: string;
}

const OTPInput = ({ phoneNumber, onVerifyOTP, onBackToPhone, loading, error }: OTPInputProps) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerifyOTP(otp);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle>Verify Your Phone</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code from SMS
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Verify Code</span>
              </div>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onBackToPhone}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Phone Number
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code? Check your SMS or try again.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPInput;
