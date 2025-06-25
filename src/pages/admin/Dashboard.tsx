// ENHANCED BY CURSOR AI: Admin Dashboard with route protection
import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const ADMIN_EMAIL = 'ecogrid.ai@gmail.com';

// CURSOR AI: Modern, professional Admin Dashboard redesign with common color palette and UI patterns
export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // CURSOR AI: State for users, vendors, quotes, responses
  const [customers, setCustomers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/admin/login');
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        // CURSOR AI: Fetch all users
        const custSnap = await getDocs(collection(db, 'users'));
        setCustomers(custSnap.docs.map(doc => doc.data()));
        const vendSnap = await getDocs(collection(db, 'vendors'));
        setVendors(vendSnap.docs.map(doc => doc.data()));
        // CURSOR AI: Fetch all quote requests
        const quoteSnap = await getDocs(collection(db, 'quoteRequests'));
        setQuotes(quoteSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        // CURSOR AI: Fetch all quote responses
        const respSnap = await getDocs(collection(db, 'quoteResponses'));
        setResponses(respSnap.docs.map(doc => doc.data()));
      } catch (err: any) {
        setError(err.message || 'Failed to load admin data.');
      } finally {
        setLoadingData(false);
      }
    }
    if (user && user.email === ADMIN_EMAIL) fetchData();
  }, [user]);

  const handleStatusUpdate = async (quoteId: string, status: string) => {
    setError('');
    setSuccess('');
    try {
      await updateDoc(doc(db, 'quoteRequests', quoteId), { status });
      setSuccess('Status updated!');
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status } : q));
    } catch (err: any) {
      setError(err.message || 'Failed to update status.');
    }
  };

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return <div className="text-center py-20">Loading or unauthorized...</div>;
  }
  if (loadingData) {
    return <div className="text-center py-20">Loading admin data...</div>;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4 min-h-screen bg-[#f6fafd]">
        {/* CURSOR AI: Only admin can see this dashboard */}
        <h1 className="text-4xl font-extrabold mb-10 text-center text-[#444e59] drop-shadow-lg">Admin Dashboard</h1>
        {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-center mb-4">{success}</div>}

        {/* CURSOR AI: Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
            <div className="text-2xl font-bold text-[#589bee] mb-2">{customers.length}</div>
            <div className="text-[#444e59] font-semibold">Customers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in delay-100">
            <div className="text-2xl font-bold text-[#5279ac] mb-2">{vendors.length}</div>
            <div className="text-[#444e59] font-semibold">Vendors</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in delay-200">
            <div className="text-2xl font-bold text-[#576779] mb-2">{quotes.length}</div>
            <div className="text-[#444e59] font-semibold">Quote Requests</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in delay-300">
            <div className="text-2xl font-bold text-[#434647] mb-2">{responses.length}</div>
            <div className="text-[#444e59] font-semibold">Quote Responses</div>
          </div>
        </div>

        {/* CURSOR AI: Customers List */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#589bee]">Customers</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4 animate-fade-in">
            <table className="min-w-full border text-sm">
              <thead><tr><th className="border px-2 py-2">Name</th><th className="border px-2 py-2">Email</th></tr></thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i}><td className="border px-2 py-2">{c.name}</td><td className="border px-2 py-2">{c.email}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* CURSOR AI: Vendors List */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#589bee]">Vendors</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4 animate-fade-in">
            <table className="min-w-full border text-sm">
              <thead><tr><th className="border px-2 py-2">Company</th><th className="border px-2 py-2">Email</th><th className="border px-2 py-2">License</th></tr></thead>
              <tbody>
                {vendors.map((v, i) => (
                  <tr key={i}><td className="border px-2 py-2">{v.companyName}</td><td className="border px-2 py-2">{v.email}</td><td className="border px-2 py-2">{v.licenseNumber}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* CURSOR AI: Quote Requests List */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#589bee]">Quote Requests</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4 animate-fade-in">
            <table className="min-w-full border text-sm">
              <thead><tr><th className="border px-2 py-2">Address</th><th className="border px-2 py-2">Customer</th><th className="border px-2 py-2">Status</th><th className="border px-2 py-2">Actions</th></tr></thead>
              <tbody>
                {quotes.map((q, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-2">{q.address}</td>
                    <td className="border px-2 py-2">{q.userEmail}</td>
                    <td className="border px-2 py-2">{q.status}</td>
                    <td className="border px-2 py-2">
                      <select value={q.status} onChange={e => handleStatusUpdate(q.id, e.target.value)} className="border rounded px-1">
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* CURSOR AI: Quote Responses List */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#589bee]">Quote Responses</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4 animate-fade-in">
            <table className="min-w-full border text-sm">
              <thead><tr><th className="border px-2 py-2">Request</th><th className="border px-2 py-2">Vendor</th><th className="border px-2 py-2">Response</th></tr></thead>
              <tbody>
                {responses.map((r, i) => (
                  <tr key={i}><td className="border px-2 py-2">{r.requestId}</td><td className="border px-2 py-2">{r.vendorEmail}</td><td className="border px-2 py-2">{r.response}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
} 