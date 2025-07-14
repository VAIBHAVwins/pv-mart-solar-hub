
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export default function CustomerForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/customer/reset-password`
      });
      if (error) throw error;
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-licorice mb-2">Reset Password</h1>
            <p className="text-brown">Enter your email to receive a password reset link</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
            <div>
              <Label htmlFor="email" className="text-licorice">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-brown focus:border-licorice"
                placeholder="Enter your email"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-brown hover:bg-licorice text-white font-semibold" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/customer/login" className="text-brown hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
