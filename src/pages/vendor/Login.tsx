
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

export default function VendorLogin() {
  const { signIn } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get any message from state (e.g., from password reset)
  const message = location.state?.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('🔄 Attempting vendor login for:', form.email);
      
      // Step 1: Try to sign in with Supabase Auth
      const { error: signInError } = await signIn(form.email, form.password);
      
      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (signInError.message.includes('email not confirmed')) {
          setError('Please check your email and verify your account before logging in.');
        } else {
          setError(signInError.message || 'Login failed');
        }
        setLoading(false);
        return;
      }

      // Step 2: Verify the user exists in our users table and is a vendor
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('email', form.email)
        .eq('role', 'vendor')
        .maybeSingle();

      if (userError) {
        console.error('❌ Error checking user data:', userError);
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (!userData) {
        console.error('❌ No vendor account found for this email');
        setError('No vendor account found for this email. Please register as a vendor first.');
        setLoading(false);
        return;
      }

      console.log('✅ Vendor login successful, redirecting to dashboard');
      navigate('/vendor/dashboard');
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
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
            <p className="text-[#4f4f56]">Access your vendor dashboard</p>
          </div>
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            <div>
              <Label htmlFor="email" className="text-[#171a21]">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#171a21]">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <Link to="/vendor/forgot-password" className="text-[#797a83] hover:underline">
              Forgot your password?
            </Link>
            <p className="text-[#4f4f56]">
              Don't have an account?{' '}
              <Link to="/vendor/register" className="text-[#797a83] hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
