
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
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showAuthSelector, setShowAuthSelector] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleAuthSuccess = () => {
    setSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const handleRegistrationSuccess = (email: string) => {
    setVerificationEmail(email);
    setShowRegistration(false);
    setShowOTPVerification(true);
  };

  const handleOTPVerificationComplete = () => {
    setShowOTPVerification(false);
    handleAuthSuccess();
  };

  if (showOTPVerification) {
    return (
      <Layout>
        <OTPVerification
          email={verificationEmail}
          onVerificationComplete={handleOTPVerificationComplete}
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
          
          {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-50 rounded mb-4">{error}</div>}
          {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-50 rounded mb-4">{success}</div>}
          
          {showAuthSelector ? (
            <AuthMethodSelector 
              mode="login"
              userType="customer"
              onSuccess={handleAuthSuccess}
            />
          ) : null}
          
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
