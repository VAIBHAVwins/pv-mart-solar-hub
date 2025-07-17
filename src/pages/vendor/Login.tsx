
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
      console.log('🔄 Attempting vendor login for:', email);

      // First check if email exists in users table with vendor role
      const { data: userEntry, error: userError } = await supabase
        .from('users')
        .select('email, role')
        .eq('email', email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('❌ Database error:', userError);
        setError('Failed to login. Please try again.');
        setLoading(false);
        return;
      }

      if (!userEntry) {
        console.log('❌ No user found in users table for:', email);
        setError('No vendor account found for this email.');
        setLoading(false);
        return;
      }

      if (userEntry.role !== 'vendor') {
        console.log('❌ User exists but not a vendor:', userEntry.role);
        setError('This email ID is registered as a customer. Please perform customer login.');
        setLoading(false);
        return;
      }

      console.log('✅ Vendor found in users table, attempting Auth login');

      // Proceed with Supabase Auth login
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error('❌ Supabase Auth login failed:', signInError);
        
        if (signInError.message?.includes('Email not confirmed')) {
          setError('Please verify your email address before logging in. Check your inbox for a verification email.');
        } else if (signInError.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError('Failed to login. Please check your credentials.');
        }
        
        setLoading(false);
        return;
      }

      console.log('✅ Auth login successful, verifying vendor access');

      // Verify the logged-in user is indeed a vendor
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ No authenticated user found after login');
        setError('Login failed. Please try again.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const { data: vendorCheck } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', user.id)
        .eq('role', 'vendor')
        .single();

      if (!vendorCheck) {
        console.error('❌ User authenticated but no vendor record found');
        setError('No vendor account found for this email.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      console.log('✅ Vendor login successful, redirecting to dashboard');
      navigate('/vendor/dashboard');
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Failed to login. Please check your credentials.');
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
