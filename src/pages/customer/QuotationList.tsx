// ENHANCED BY CURSOR AI: Customer quote requests list with vendor responses
import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

// CURSOR AI: Modern, professional Customer Quotation List redesign with customer color palette and UI patterns
export default function QuotationList() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // CURSOR AI: Fetch user's quote requests
        const reqSnap = await getDocs(query(collection(db, 'quoteRequests'), where('userId', '==', user?.uid)));
        const reqs = reqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(reqs);
        // CURSOR AI: Fetch all responses for these requests
        const respSnap = await getDocs(collection(db, 'quoteResponses'));
        const allResponses = respSnap.docs.map(doc => doc.data());
        const respMap: { [key: string]: any[] } = {};
        reqs.forEach(req => {
          respMap[req.id] = allResponses.filter(r => r.requestId === req.id);
        });
        setResponses(respMap);
      } catch (err: any) {
        setError(err.message || 'Failed to load your quote requests.');
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchData();
  }, [user]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8e1] py-16 px-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-[#8b4a08] drop-shadow">Your Quote Requests</h1>
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
          {!loading && requests.length === 0 && <div className="text-center">You have not submitted any quote requests yet.</div>}
          <div className="space-y-8">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                <div className="font-semibold mb-2 text-[#8b4a08]">{req.address} <span className="text-[#52796f]">({req.roofType})</span></div>
                <div className="text-sm mb-1 text-[#52796f]">Energy Usage: {req.energyUsage} kWh/month</div>
                <div className="text-sm mb-1 text-[#52796f]">Requirements: {req.requirements}</div>
                <div className="text-sm mb-1 text-[#52796f]">Contact: {req.contactPreference}</div>
                <div className="text-sm mb-1 text-[#52796f]">Budget: {req.budget}</div>
                <div className="text-xs text-gray-500 mb-2">Status: {req.status}</div>
                {/* CURSOR AI: Show vendor responses */}
                <div className="mt-4">
                  <div className="font-semibold text-[#589bee] mb-1">Vendor Responses:</div>
                  {responses[req.id] && responses[req.id].length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {responses[req.id].map((resp, idx) => (
                        <li key={idx} className="mb-1">
                          <span className="font-semibold text-[#5279ac]">{resp.vendorEmail}:</span> {resp.response}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-sm">No responses yet.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 