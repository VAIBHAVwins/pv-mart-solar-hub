// ENHANCED BY CURSOR AI: Vendor quote opportunities page (view/respond to quote requests)
import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// CURSOR AI: Modern, professional Vendor Quotation List redesign with vendor color palette and UI patterns
export default function QuotationList() {
  const { user } = useSupabaseAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('quote_requests').select('*');
        if (error) throw error;
        setRequests(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load quote requests.');
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleResponseChange = (id: string, value: string) => {
    setResponse(prev => ({ ...prev, [id]: value }));
  };

  const handleRespond = async (req: any) => {
    setError('');
    setSuccess('');
    try {
      const { error } = await supabase.from('quote_responses').insert([
        {
          requestId: req.id,
          vendorId: user?.id,
          vendorEmail: user?.email,
          response: response[req.id],
          createdAt: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      setSuccess('Response sent!');
      setResponse(prev => ({ ...prev, [req.id]: '' }));
    } catch (err: any) {
      setError(err.message || 'Failed to send response.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f6] py-16 px-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-[#797a83] drop-shadow">Quote Opportunities</h1>
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
          {success && <div className="text-green-600 font-semibold text-center mb-4">{success}</div>}
          {!loading && requests.length === 0 && <div className="text-center">No quote requests available.</div>}
          <div className="space-y-8">
            {requests.map(req => (
              <div key={req.id} className="bg-[#e6d3b3] rounded-xl shadow-lg p-6 animate-fade-in">
                <div className="font-semibold mb-2 text-[#797a83]">{req.address} <span className="text-[#4f4f56]">({req.roofType})</span></div>
                <div className="text-sm mb-1 text-[#4f4f56]">Energy Usage: {req.energyUsage} kWh/month</div>
                <div className="text-sm mb-1 text-[#4f4f56]">Requirements: {req.requirements}</div>
                <div className="text-sm mb-1 text-[#4f4f56]">Contact: {req.contactPreference}</div>
                <div className="text-sm mb-1 text-[#4f4f56]">Budget: {req.budget}</div>
                <div className="text-xs text-gray-500 mb-2">Requested by: {req.userEmail}</div>
                {/* CURSOR AI: Vendor response form */}
                <textarea
                  className="border rounded px-2 py-2 w-full mb-2 border-[#b07e66] focus:border-[#797a83] bg-white"
                  rows={2}
                  placeholder="Write your response/quotation here..."
                  value={response[req.id] || ''}
                  onChange={e => handleResponseChange(req.id, e.target.value)}
                />
                <Button
                  onClick={() => handleRespond(req)}
                  className="bg-[#797a83] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-[#4f4f56] transition"
                  disabled={!response[req.id]}
                >
                  Send Response
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 