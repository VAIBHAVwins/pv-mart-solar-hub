// ENHANCED BY CURSOR AI: Reusable email verification notice component
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EmailVerificationNotice({ user }: { user: any }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      // Placeholder for the removed sendEmailVerification function
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded text-center max-w-lg mx-auto mt-12">
      {/* CURSOR AI: Email verification notice */}
      <div className="mb-2 font-semibold">Please verify your email address to access your dashboard.</div>
      <div className="mb-4 text-sm">Check your inbox for a verification link. If you didn't receive it, you can resend below.</div>
      {sent && <div className="text-green-700 mb-2">Verification email sent!</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Button onClick={handleResend} disabled={loading || sent} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold">
        {loading ? 'Sending...' : sent ? 'Sent' : 'Resend Verification Email'}
      </Button>
    </div>
  );
} 