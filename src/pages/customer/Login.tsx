
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

const CustomerLogin = () => {
  const { signIn, user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserRoleAndRedirect(user.id);
    }
  }, [user, navigate]);

  const checkUserRoleAndRedirect = async (userId: string) => {
    try {
      // Check if user exists in customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (customerError) {
        console.error('Error checking customer role:', customerError);
        return;
      }

      if (customerData) {
        // User is a customer
        const installationType = sessionStorage.getItem('selectedInstallationType');
        const gridType = sessionStorage.getItem('selectedGridType');
        
        if (installationType && gridType) {
          // Clear the session storage
          sessionStorage.removeItem('selectedInstallationType');
          sessionStorage.removeItem('selectedGridType');
          // Redirect to requirements form
          navigate('/customer/requirements');
        } else {
          // Regular login, go to dashboard
          navigate('/customer/dashboard');
        }
        return;
      }

      // User not found in customers table
      setError('Account not found. Please register first or contact support.');
      
    } catch (err) {
      console.error('Error checking user role:', err);
      setError('Login failed. Please try again.');
    }
  };

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
      // First, check if user exists as customer before attempting login
      const { data: customerData, error: customerCheckError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (customerCheckError) {
        console.error('Error checking customer:', customerCheckError);
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (!customerData) {
        // Check if email exists as vendor
        const { data: vendorData, error: vendorCheckError } = await supabase
          .from('vendors')
          .select('id')
          .eq('email', formData.email)
          .maybeSingle();

        if (vendorCheckError) {
          console.error('Error checking vendor:', vendorCheckError);
          setError('Login failed. Please try again.');
          setLoading(false);
          return;
        }

        if (vendorData) {
          setError('This email is registered as a vendor. Please use the vendor login page.');
          setLoading(false);
          return;
        }

        setError('No customer account found with this email. Please register as a customer first.');
        setLoading(false);
        return;
      }

      // Proceed with authentication only if customer exists
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
      
      // Success case is handled by useEffect above
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
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
              />
            </div>
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-brown text-white py-3 rounded-lg font-bold hover:bg-licorice shadow-md transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-brown mb-2">
              Don't have an account?{' '}
              <Link to="/customer/register" className="text-licorice hover:underline font-semibold">
                Create Account
              </Link>
            </p>
            <Link to="/customer/forgot-password" className="text-brown hover:underline">
              Forgot your password?
            </Link>
            <br />
            <Link to="/" className="text-brown hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerLogin;
