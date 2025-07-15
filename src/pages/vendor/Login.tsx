
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useSupabaseAuth();
  const navigate = useNavigate();

  const checkUserRoleAndRedirect = async (userId: string) => {
    try {
      // Check if user exists in vendors table
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (vendorError) {
        console.error('Error checking vendor role:', vendorError);
        setError('Login failed. Please try again.');
        return;
      }

      if (vendorData) {
        // User is a vendor
        navigate('/vendor/dashboard');
        return;
      }

      // Check if user exists in customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (customerError) {
        console.error('Error checking customer role:', customerError);
        setError('Login failed. Please try again.');
        return;
      }

      if (customerData) {
        // User is a customer trying to login as vendor
        setError('This account is registered as a customer. Please use the customer login page.');
        return;
      }

      // User not found in either table
      setError('Account not found. Please register first or contact support.');
      
    } catch (err) {
      console.error('Error checking user role:', err);
      setError('Login failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before logging in.');
        } else {
          setError(`Login failed: ${signInError.message}`);
        }
        return;
      }

      // Get user from auth state after successful login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await checkUserRoleAndRedirect(user.id);
      }
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#171a21] mb-2">Vendor Login</h1>
            <p className="text-[#4f4f56]">Access your vendor dashboard and manage quotations</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#4f4f56] mb-2">
              Don't have an account?{' '}
              <Link to="/vendor/register" className="text-[#b07e66] hover:underline font-semibold">
                Create Account
              </Link>
            </p>
            <Link to="/vendor/forgot-password" className="text-[#4f4f56] hover:underline text-sm">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorLogin;
