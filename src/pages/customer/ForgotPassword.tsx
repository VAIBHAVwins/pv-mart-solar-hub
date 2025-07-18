
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export default function CustomerForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // First verify the user exists and is a customer
      const { data: userEntry } = await supabase
        .from('users')
        .select('email, role')
        .eq('email', email)
        .single();

      if (!userEntry) {
        setError('No account found with this email address.');
        setLoading(false);
        return;
      }

      if (userEntry.role !== 'customer') {
        setError('This email is registered as a vendor. Please use the vendor password reset page.');
        setLoading(false);
        return;
      }

      const { error } = await resetPassword(email);
      if (error) throw error;
      
      setSuccess('Password reset email sent! Please check your inbox and follow the instructions.');
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
            {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-50 rounded">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-50 rounded">{success}</div>}
            
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
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brown hover:bg-licorice text-white font-semibold" 
              disabled={loading}
            >
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
