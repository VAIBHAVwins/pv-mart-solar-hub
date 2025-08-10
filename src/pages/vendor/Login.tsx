
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AuthMethodSelector from '@/components/auth/AuthMethodSelector';
import { SupabaseAuthForm } from '@/components/auth/SupabaseAuthForm';
import PhonePasswordAuth from '@/components/auth/PhonePasswordAuth';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VendorLogin = () => {
  const [authMethod, setAuthMethod] = useState<'select' | 'email' | 'phone'>('select');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/vendor/dashboard');
  };

  const handleBackToSelection = () => {
    setAuthMethod('select');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Vendor Login
            </h1>
            <p className="text-gray-600 text-lg">
              Access your vendor dashboard
            </p>
          </div>

          {authMethod === 'select' && (
            <AuthMethodSelector 
              onMethodSelect={setAuthMethod}
              userType="vendor"
            />
          )}

          {authMethod === 'email' && (
            <div className="space-y-6">
              <Button
                onClick={handleBackToSelection}
                variant="ghost"
                className="mb-4 text-orange-600 hover:text-orange-800 hover:bg-orange-50 font-medium"
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
                className="mb-4 text-red-600 hover:text-red-800 hover:bg-red-50 font-medium"
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
              <Link to="/vendor/register" className="text-orange-600 hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorLogin;
