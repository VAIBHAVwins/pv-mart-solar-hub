
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Send } from 'lucide-react';

interface PhoneAuthFormProps {
  onSendOTP: (phoneNumber: string) => void;
  loading?: boolean;
  error?: string;
}

const PhoneAuthForm = ({ onSendOTP, loading, error }: PhoneAuthFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      onSendOTP(phoneNumber);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Remove all non-digits
    const numericValue = value.replace(/\D/g, '');
    
    // Format as needed (basic formatting)
    let formattedValue = numericValue;
    if (numericValue.length <= 10) {
      setPhoneNumber(formattedValue);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle>Phone Verification</CardTitle>
        <CardDescription>
          Enter your phone number to receive a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="9876543210"
                className="pl-12"
                maxLength={10}
                required
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
            type="submit"
            disabled={loading || phoneNumber.length < 10}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Code...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Send Verification Code</span>
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneAuthForm;
