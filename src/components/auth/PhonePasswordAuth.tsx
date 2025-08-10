
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhonePasswordAuthProps {
  mode: 'login' | 'register';
  userType: 'customer' | 'vendor';
  onSuccess?: () => void;
}

const PhonePasswordAuth = ({ mode, userType, onSuccess }: PhonePasswordAuthProps) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        // For login, get email by phone number first
        const { data: emailData, error: emailError } = await supabase.rpc('get_email_by_phone', {
          _raw_phone: phone
        });

        if (emailError || !emailData) {
          setError('Phone number not found. Please check your phone number or sign up first.');
          setLoading(false);
          return;
        }

        // Sign in with the retrieved email
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: emailData,
          password: password
        });

        if (signInError) {
          setError('Invalid phone number or password. Please try again.');
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        // For registration, use phone as email with domain
        const phoneEmail = `${phone.replace(/[^0-9]/g, '')}@phone.pvmart.com`;
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: phoneEmail,
          password: password,
          options: {
            data: { 
              user_type: userType,
              phone: phone
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="w-6 h-6 mr-2 text-green-600" />
          {mode === 'login' ? 'Sign In' : 'Sign Up'} with Phone
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Enter your phone number and password' 
            : 'Create an account with your phone number'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pr-10"
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
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhonePasswordAuth;
