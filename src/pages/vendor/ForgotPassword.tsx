
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export default function VendorForgotPassword() {
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
      // First verify the user exists and is a vendor
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

      if (userEntry.role !== 'vendor') {
        setError('This email is registered as a customer. Please use the customer password reset page.');
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
    <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#171a21] mb-2">Reset Password</h1>
            <p className="text-[#4f4f56]">Enter your email to receive a password reset link</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-100 rounded">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-100 rounded">{success}</div>}
            
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
            
            <Button 
              type="submit" 
              className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/vendor/login" className="text-[#4f4f56] hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
