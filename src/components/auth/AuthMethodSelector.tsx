
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import PhonePasswordAuth from './PhonePasswordAuth';
import { Input } from '@/components/ui/input';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthMethodSelectorProps {
  mode: 'login' | 'register';
  userType: 'customer' | 'vendor';
  onSuccess?: () => void;
}

const AuthMethodSelector = ({ mode, userType, onSuccess }: AuthMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useSupabaseAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        const { error } = await signUp(email, password, {
          data: { user_type: userType },
          options: { emailRedirectTo: `${window.location.origin}/` }
        });
        if (error) {
          setError(error.message);
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

  if (selectedMethod === 'phone') {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedMethod(null)}
          className="mb-4"
        >
          ← Back to options
        </Button>
        <PhonePasswordAuth 
          mode={mode} 
          userType={userType} 
          onSuccess={onSuccess} 
        />
      </div>
    );
  }

  if (selectedMethod === 'email') {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedMethod(null)}
          className="mb-4"
        >
          ← Back to options
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              {mode === 'login' ? 'Sign In' : 'Sign Up'} with Email
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Enter your email and password to sign in' 
                : 'Create an account with your email address'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600">
          Choose your preferred {mode === 'login' ? 'sign in' : 'sign up'} method
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          variant="outline"
          onClick={() => setSelectedMethod('email')}
          className="h-16 flex items-center justify-center space-x-3 text-base hover:bg-gray-50"
        >
          <Mail className="w-6 h-6 text-blue-600" />
          <span>{mode === 'login' ? 'Sign in' : 'Sign up'} with Email</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setSelectedMethod('phone')}
          className="h-16 flex items-center justify-center space-x-3 text-base hover:bg-gray-50"
        >
          <Phone className="w-6 h-6 text-green-600" />
          <span>{mode === 'login' ? 'Sign in' : 'Sign up'} with Phone</span>
        </Button>
      </div>
    </div>
  );
};

export default AuthMethodSelector;
