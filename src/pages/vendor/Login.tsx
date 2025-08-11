
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import { VendorRegistrationForm } from '@/components/vendor/VendorRegistrationForm';
import { OTPVerification } from '@/components/auth/OTPVerification';
import AuthMethodSelector from '@/components/auth/AuthMethodSelector';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }

      if (authMethod === 'email') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data?.user) {
          if (!data.user.email_confirmed_at) {
            setError('Please verify your email before logging in.');
            setLoading(false);
            return;
          }

          const { data: userRecord, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (userError) {
            setError('Failed to fetch user role.');
            setLoading(false);
            return;
          }

          if (userRecord?.role === 'vendor') {
            window.location.href = '/';
          } else {
            setError('Invalid credentials or unauthorized access.');
            setLoading(false);
          }
        }
      } else if (authMethod === 'phone') {
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: email,
          options: {
            shouldCreateUser: false,
            channel: 'sms'
          },
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        setVerificationEmail(email);
        setShowOTPVerification(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setSuccess('Registration successful! Please check your email to verify your account.');
    setShowRegistration(false);
  };

  const handleOTPSubmit = async (otp: string) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: verificationEmail,
        token: otp,
        type: 'sms',
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          setError('Failed to fetch user role.');
          setLoading(false);
          return;
        }

        if (userRecord?.role === 'vendor') {
          window.location.href = '/';
        } else {
          setError('Invalid credentials or unauthorized access.');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
        <OTPVerification
          email={verificationEmail}
          onVerificationComplete={() => {
            setShowOTPVerification(false);
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          }}
          onBack={() => setShowOTPVerification(false)}
        />
      </Layout>
    );
  }

  if (showRegistration) {
    return (
      <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
        <VendorRegistrationForm />
      </Layout>
    );
  }

  return (
    <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#171a21] mb-2">Vendor Login</h1>
            <p className="text-[#4f4f56]">Access your business dashboard</p>
          </div>
          
          <AuthMethodSelector 
            authMethod={authMethod} 
            onMethodChange={setAuthMethod}
          />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-100 rounded">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-100 rounded">{success}</div>}
            
            <div>
              <Label htmlFor="email" className="text-[#171a21]">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-[#171a21]">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83] pr-10"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-[#4f4f56]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#4f4f56]" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => setShowRegistration(true)}
              className="text-[#4f4f56] hover:underline"
            >
              Don't have an account? Register here
            </button>
            <div>
              <Link to="/" className="text-[#171a21] hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
