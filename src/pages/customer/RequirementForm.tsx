// ENHANCED BY CURSOR AI: Full customer quote request form with Firestore integration
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';

// CURSOR AI: Modern, professional Customer Quote Request Form redesign with customer color palette and UI patterns
export default function RequirementForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    address: '',
    roofType: '',
    energyUsage: '',
    requirements: '',
    contactPreference: '',
    budget: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await addDoc(collection(db, 'quoteRequests'), {
        ...form,
        userId: user?.uid,
        userEmail: user?.email,
        createdAt: Timestamp.now(),
        status: 'pending',
      });
      setSuccess('Your quote request has been submitted!');
      setForm({ address: '', roofType: '', energyUsage: '', requirements: '', contactPreference: '', budget: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8e1] py-16 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl animate-fade-in">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-[#8b4a08] drop-shadow">Request a Solar Quote</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
            <div>
              <Label htmlFor="address" className="text-[#3d1604]">Property Address</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} required className="mt-1 border-[#fecb00] focus:border-[#8b4a08]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="roofType" className="text-[#3d1604]">Roof Type</Label>
                <Input id="roofType" name="roofType" value={form.roofType} onChange={handleChange} placeholder="e.g. Flat, Sloped, Metal" required className="mt-1 border-[#fecb00] focus:border-[#8b4a08]" />
              </div>
              <div>
                <Label htmlFor="energyUsage" className="text-[#3d1604]">Monthly Energy Usage (kWh)</Label>
                <Input id="energyUsage" name="energyUsage" value={form.energyUsage} onChange={handleChange} placeholder="e.g. 500" required className="mt-1 border-[#fecb00] focus:border-[#8b4a08]" />
              </div>
            </div>
            <div>
              <Label htmlFor="requirements" className="text-[#3d1604]">Project Requirements</Label>
              <textarea id="requirements" name="requirements" value={form.requirements} onChange={handleChange} className="border rounded px-4 py-2 w-full mt-1 border-[#fecb00] focus:border-[#8b4a08]" rows={3} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactPreference" className="text-[#3d1604]">Contact Preference</Label>
                <Input id="contactPreference" name="contactPreference" value={form.contactPreference} onChange={handleChange} placeholder="e.g. Phone, Email" required className="mt-1 border-[#fecb00] focus:border-[#8b4a08]" />
              </div>
              <div>
                <Label htmlFor="budget" className="text-[#3d1604]">Budget Range (INR)</Label>
                <Input id="budget" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. 1,00,000 - 2,00,000" required className="mt-1 border-[#fecb00] focus:border-[#8b4a08]" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#fecb00] text-[#190a02] py-3 rounded-lg font-bold hover:bg-[#ffe066] shadow-md transition" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
} 