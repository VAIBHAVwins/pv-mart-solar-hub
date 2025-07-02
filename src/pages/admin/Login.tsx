import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { validation, sanitize, validationMessages } from '@/lib/validation';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useSupabaseAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in as admin
    if (user && !authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  const checkAdminRole = async () => {
    if (!user) return;
    
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');
    
    if (roles && roles.length > 0) {
      navigate('/admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate input
      const email = sanitize.text(formData.email);
      const password = formData.password;

      if (!validation.email(email)) {
        setError(validationMessages.email);
        return;
      }

      if (!validation.required(password)) {
        setError(validationMessages.required);
        return;
      }

      // Attempt Supabase authentication
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError('Invalid credentials');
        return;
      }

      // Check if user has admin role
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('role', 'admin');

      if (roleError || !roles || roles.length === 0) {
        await supabase.auth.signOut();
        setError('Access denied: Admin privileges required');
        return;
      }

      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Access the admin dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@pvmart.com or ecogrid.ai@gmail.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Only admin users can access this area. Contact your administrator for access.
          </div>
        </div>
      </div>
    </Layout>
  );
}
