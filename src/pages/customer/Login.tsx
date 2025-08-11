
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import { CustomerRegistrationForm } from '@/components/auth/CustomerRegistrationForm';
import { OTPVerification } from '@/components/auth/OTPVerification';
import AuthMethodSelector from '@/components/auth/AuthMethodSelector';

export default function CustomerLogin() {
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
      if (authMethod === 'email') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
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
        } else {
          setVerificationEmail(email);
          setShowOTPVerification(true);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = (phone: string) => {
    setVerificationEmail(phone);
    setShowRegistration(false);
    setShowOTPVerification(true);
  };

  const handleOTPSubmit = async (otp: string) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: verificationEmail,
        token: otp,
        type: 'sms',
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <Layout>
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
      <Layout>
        <CustomerRegistrationForm 
          onOTPRequired={handleRegistrationSuccess}
          onBack={() => setShowRegistration(false)}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-licorice mb-2">Customer Login</h1>
            <p className="text-brown">Access your solar energy dashboard</p>
          </div>
          
          <AuthMethodSelector 
            authMethod={authMethod} 
            onMethodChange={setAuthMethod}
          />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-50 rounded">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-50 rounded">{success}</div>}
            
            <div>
              <Label htmlFor="email" className="text-licorice">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-licorice">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 border-brown focus:border-licorice pr-10"
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
                    <EyeOff className="h-4 w-4 text-brown" />
                  ) : (
                    <Eye className="h-4 w-4 text-brown" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brown hover:bg-licorice text-white font-semibold" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => setShowRegistration(true)}
              className="text-brown hover:underline"
            >
              Don't have an account? Register here
            </button>
            <div>
              <Link to="/" className="text-licorice hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
