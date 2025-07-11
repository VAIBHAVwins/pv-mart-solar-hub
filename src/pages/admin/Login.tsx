
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = [
  {
    email: 'ecogrid.ai@gmail.com',
    password: 'ECOGRID_AI-28/02/2025',
    name: 'EcoGrid Admin'
  }
  // Add more admin credentials here as needed
];

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  // Check if user is already authenticated and is admin
  useEffect(() => {
    const checkAdminAuth = async () => {
      if (user) {
        // Check if current user is in our admin credentials list
        const isAdmin = ADMIN_CREDENTIALS.some(admin => admin.email === user.email);
        if (isAdmin) {
          navigate('/admin');
          return;
        }
      }
      setIsCheckingAuth(false);
    };

    checkAdminAuth();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if credentials match our hardcoded admin list
      const adminCredential = ADMIN_CREDENTIALS.find(
        admin => admin.email === email && admin.password === password
      );

      if (!adminCredential) {
        throw new Error('Invalid admin credentials. Access denied.');
      }

      // Try to sign up the user first (in case they don't exist)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: adminCredential.name,
            user_type: 'admin'
          },
          emailRedirectTo: window.location.origin
        }
      });

      // If user already exists, sign them in
      if (signUpError && signUpError.message.includes('already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (signInError) throw signInError;
      } else if (signUpError) {
        throw signUpError;
      }

      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        // Ensure user has admin role in database
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userData.user.id,
            role: 'admin'
          }, {
            onConflict: 'user_id,role'
          });

        if (roleError) {
          console.warn('Could not assign admin role:', roleError);
        }

        // Redirect to admin dashboard
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solar-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-solar-primary" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your admin account
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your admin credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-solar-primary hover:bg-solar-secondary text-white"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-md">
                    <strong>Admin Credentials:</strong><br />
                    Email: ecogrid.ai@gmail.com<br />
                    Password: ECOGRID_AI-28/02/2025
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
