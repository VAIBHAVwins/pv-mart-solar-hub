
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AuthMethodSelector from '@/components/auth/AuthMethodSelector';
import { SupabaseAuthForm } from '@/components/auth/SupabaseAuthForm';
import PhonePasswordAuth from '@/components/auth/PhonePasswordAuth';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerLogin = () => {
  const [authMethod, setAuthMethod] = useState<'select' | 'email' | 'phone'>('select');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/customer/dashboard');
  };

  const handleBackToSelection = () => {
    setAuthMethod('select');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Customer Login
            </h1>
            <p className="text-gray-600">
              Access your customer dashboard
            </p>
          </div>

          {authMethod === 'select' && (
            <AuthMethodSelector 
              onMethodSelect={setAuthMethod}
              userType="customer"
            />
          )}

          {authMethod === 'email' && (
            <div className="space-y-4">
              <Button
                onClick={handleBackToSelection}
                variant="ghost"
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to method selection
              </Button>
              <SupabaseAuthForm onClose={handleAuthSuccess} />
            </div>
          )}

          {authMethod === 'phone' && (
            <div className="space-y-4">
              <Button
                onClick={handleBackToSelection}
                variant="ghost"
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to method selection
              </Button>
              <PhonePasswordAuth onSuccess={handleAuthSuccess} />
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/customer/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerLogin;
