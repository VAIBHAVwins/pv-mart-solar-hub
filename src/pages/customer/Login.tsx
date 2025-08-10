
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Customer Login
            </h1>
            <p className="text-gray-600 text-lg">
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
            <div className="space-y-6">
              <Button
                onClick={handleBackToSelection}
                variant="ghost"
                className="mb-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to method selection
              </Button>
              <SupabaseAuthForm onClose={handleAuthSuccess} />
            </div>
          )}

          {authMethod === 'phone' && (
            <div className="space-y-6">
              <Button
                onClick={handleBackToSelection}
                variant="ghost"
                className="mb-4 text-green-600 hover:text-green-800 hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to method selection
              </Button>
              <PhonePasswordAuth onSuccess={handleAuthSuccess} />
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/customer/register" className="text-blue-600 hover:underline font-semibold">
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
