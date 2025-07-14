
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

export default function CustomerResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a password reset session
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is in password recovery mode
        console.log('Password recovery session detected');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      navigate('/customer/login', { 
        state: { message: 'Password updated successfully! Please login with your new password.' }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-licorice mb-2">Set New Password</h1>
            <p className="text-brown">Enter your new password below</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            <div>
              <Label htmlFor="password" className="text-licorice">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-licorice">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-brown hover:bg-licorice text-white font-semibold" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
