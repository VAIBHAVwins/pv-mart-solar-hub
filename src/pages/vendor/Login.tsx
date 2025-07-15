
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if email exists in vendors or customers table
      const { data: vendor } = await supabase.from('vendors').select('email').eq('email', email).single();
      const { data: customer } = await supabase.from('customers').select('email').eq('email', email).single();
      if (!vendor && customer) {
        setError('This email ID is registered as a customer. Please perform customer login.');
        setLoading(false);
        return;
      }
      if (!vendor && !customer) {
        setError('Failed to login. Please check your credentials or create account.');
        setLoading(false);
        return;
      }
      // Only proceed if vendor exists
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError('Failed to login. Please check your credentials.');
        await supabase.auth.signOut(); // Ensure no partial login state
        setLoading(false);
        return;
      }
      // After sign in, check which table the user is in
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data: customerCheck } = await supabase.from('customers').select('id').eq('id', userId).single();
      const { data: vendorCheck } = await supabase.from('vendors').select('id').eq('id', userId).single();
      if (customerCheck && vendorCheck) {
        setError('Account conflict: This user exists as both customer and vendor. Please contact support.');
        await supabase.auth.signOut(); // Ensure no partial login state
        setLoading(false);
        return;
      }
      if (!vendorCheck) {
        setError('No vendor account found for this email.');
        await supabase.auth.signOut(); // Ensure no partial login state
        setLoading(false);
        return;
      }
      navigate('/vendor/dashboard');
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
