
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

const CustomerLogin = () => {
  const { signIn, user, userRole } = useSupabaseAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && userRole === 'customer') {
      navigate('/customer/dashboard');
    }
  }, [user, userRole, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First verify the user exists and is a customer
      const { data: userEntry, error: userError } = await supabase
        .from('users')
        .select('email, role, is_active')
        .eq('email', formData.email)
        .maybeSingle();

      if (userError) {
        console.error('Database error:', userError);
        setError('Failed to verify account. Please try again.');
        setLoading(false);
        return;
      }

      if (!userEntry) {
        setError('No account found with this email. Please create an account first.');
        setLoading(false);
        return;
      }

      if (userEntry.role !== 'customer') {
        setError('This email is registered as a vendor. Please use the vendor login page.');
        setLoading(false);
        return;
      }

      if (!userEntry.is_active) {
        setError('Your account has been deactivated. Please contact support.');
        setLoading(false);
        return;
      }

      // Proceed with login
      const { error: signInError } = await signIn(formData.email, formData.password);
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before logging in.');
        } else {
          setError(`Login failed: ${signInError.message}`);
        }
        setLoading(false);
        return;
      }

      // Login successful - navigation will be handled by useEffect
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-licorice drop-shadow">Customer Login</h1>
          <p className="text-brown mb-8 text-center">Login to access your solar dashboard</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-licorice">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-licorice">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            
            {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-50 rounded">{error}</div>}
            
            <Button
              type="submit"
              className="w-full bg-brown text-white py-3 rounded-lg font-bold hover:bg-licorice shadow-md transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-brown">
              Don't have an account?{' '}
              <Link to="/customer/register" className="text-licorice hover:underline font-semibold">
                Create Account
              </Link>
            </p>
            <Link to="/customer/forgot-password" className="text-brown hover:underline block">
              Forgot your password?
            </Link>
            <Link to="/" className="text-brown hover:underline block">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerLogin;
