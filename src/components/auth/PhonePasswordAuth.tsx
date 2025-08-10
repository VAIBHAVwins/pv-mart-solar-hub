
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhonePasswordAuthProps {
  onSuccess: () => void;
}

const PhonePasswordAuth = ({ onSuccess }: PhonePasswordAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try multiple phone number formats
      const phoneFormats = [
        phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`,
        phoneNumber,
        phoneNumber.replace(/^\+91/, ''),
        phoneNumber.replace(/^91/, ''),
      ];

      let userData = null;
      
      // Try to find user with any of the phone formats
      for (const format of phoneFormats) {
        const { data, error: userError } = await supabase
          .from('users')
          .select('email, id')
          .eq('phone', format)
          .maybeSingle();

        if (data && !userError) {
          userData = data;
          break;
        }
      }

      if (!userData?.email) {
        setError('No account found with this phone number. Please check your number or register first.');
        return;
      }

      // Try to sign in with the found email and provided password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid phone number or password. Please check your credentials.');
        } else {
          setError(`Login failed: ${signInError.message}`);
        }
        return;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Remove all non-digits
    const numericValue = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-2">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Phone & Password Login</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your phone number and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
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
                className="pl-12 h-12"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pr-12 h-12"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || phoneNumber.length < 10 || !password}
            className="w-full h-12 text-base font-medium"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Sign In</span>
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

export default PhonePasswordAuth;
