
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

export default function VendorResetPassword() {
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
      
      navigate('/vendor/login', { 
        state: { message: 'Password updated successfully! Please login with your new password.' }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#171a21] mb-2">Set New Password</h1>
            <p className="text-[#4f4f56]">Enter your new password below</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            <div>
              <Label htmlFor="password" className="text-[#171a21]">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-[#171a21]">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
