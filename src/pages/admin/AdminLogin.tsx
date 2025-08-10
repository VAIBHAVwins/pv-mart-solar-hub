
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // First check if email exists in admin_users table
      const { data: adminUser, error: checkError } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (checkError || !adminUser) {
        setError('Access denied. This email is not authorized for admin access.');
        setLoading(false);
        return;
      }

      // Send magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`
        }
      });

      if (authError) throw authError;

      setMessage('Magic link sent! Check your email to access the admin dashboard.');
    } catch (err: any) {
      console.error('Magic link error:', err);
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Access</CardTitle>
            <CardDescription>
              PV Mart Administration Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  required
                  className="w-full"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {message && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{message}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Magic Link...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Send Magic Link</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Only authorized administrators can access this portal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;
