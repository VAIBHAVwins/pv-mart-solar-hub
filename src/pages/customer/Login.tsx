
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

export default function CustomerLogin() {
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
      console.log('🔄 Attempting customer login for:', form.email);
      
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

      // Step 2: Verify the user exists in our users table and is a customer
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('email', form.email)
        .eq('role', 'customer')
        .maybeSingle();

      if (userError) {
        console.error('❌ Error checking user data:', userError);
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (!userData) {
        console.error('❌ No customer account found for this email');
        setError('No customer account found for this email. Please register as a customer first.');
        setLoading(false);
        return;
      }

      console.log('✅ Customer login successful, redirecting to dashboard');
      navigate('/customer/dashboard');
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-licorice mb-2">Customer Login</h1>
            <p className="text-brown">Access your customer dashboard</p>
          </div>
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            <div>
              <Label htmlFor="email" className="text-licorice">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-licorice">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-brown hover:bg-licorice text-white font-semibold" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <Link to="/customer/forgot-password" className="text-brown hover:underline">
              Forgot your password?
            </Link>
            <p className="text-brown">
              Don't have an account?{' '}
              <Link to="/customer/register" className="text-brown hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
