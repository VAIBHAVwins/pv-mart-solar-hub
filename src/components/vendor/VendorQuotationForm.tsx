import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function VendorQuotationForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    system_type: '',
    capacity_kw: '',
    panel_brand: '',
    inverter_brand: '',
    cable_brand: '',
    cable_length_included: '',
    component_pricing: '', // JSON string
    total_price: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setVerifying(false);
    try {
      const { data, error } = await supabase.from('vendor_quotations').insert([
        {
          system_type: form.system_type,
          capacity_kw: Number(form.capacity_kw),
          panel_brand: form.panel_brand,
          inverter_brand: form.inverter_brand,
          cable_brand: form.cable_brand,
          cable_length_included: Number(form.cable_length_included),
          component_pricing: JSON.parse(form.component_pricing),
          total_price: Number(form.total_price),
        },
      ]).select();
      if (error || !data || !data[0]?.id) throw error || new Error('Submission failed');
      setVerifying(true);
      // Verification protocol: 3s for fast, 10s for max
      const verifyPromise = supabase.from('vendor_quotations').select('*').eq('id', data[0].id).single();
      const timeout3s = new Promise((_, reject) => setTimeout(() => reject(new Error('Verification taking longer than expected...')), 3000));
      const timeout10s = new Promise((_, reject) => setTimeout(() => reject(new Error('Verification timed out')), 10000));
      let verifyData, verifyError;
      try {
        ({ data: verifyData, error: verifyError } = await Promise.race([verifyPromise, timeout3s]));
        if (verifyError || !verifyData) throw verifyError || new Error('Verification failed');
        setSuccess(true);
        setPopupMessage('Quotation submitted and verified successfully!');
        setShowPopup(true);
        setTimeout(() => { setShowPopup(false); onClose(); }, 2000);
      } catch (e) {
        // If 3s passed, show loader and wait up to 10s
        try {
          ({ data: verifyData, error: verifyError } = await Promise.race([verifyPromise, timeout10s]));
          if (verifyError || !verifyData) throw verifyError || new Error('Verification failed');
          setSuccess(true);
          setPopupMessage('Quotation submitted and verified successfully!');
          setShowPopup(true);
          setTimeout(() => { setShowPopup(false); onClose(); }, 2000);
        } catch (e2) {
          setError(e2.message || 'Verification failed');
          setPopupMessage('Failed to submit or verify quotation.');
          setShowPopup(true);
        }
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
      setPopupMessage('Failed to submit or verify quotation.');
      setShowPopup(true);
      setLoading(false);
    }
  };

  return (
    <>
      {verifying && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(0,0,0,0.5)'}}>
          <div className="bg-white bg-opacity-80 p-8 rounded-lg flex flex-col items-center">
            <div className="loader mb-4" style={{width: 48, height: 48, border: '6px solid #ccc', borderTop: '6px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
            <div className="text-lg font-semibold">Verifying submission...</div>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-lg font-bold mb-2">{popupMessage}</div>
            <button className="btn btn-primary mt-2" onClick={() => { setShowPopup(false); if (success) onClose(); }}>OK</button>
          </div>
        </div>
      )}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4">
          <h2 className="text-xl font-bold mb-2">Submit Vendor Quotation</h2>
          <input name="system_type" placeholder="System Type (ongrid/offgrid/hybrid)" value={form.system_type} onChange={handleChange} className="input" required />
          <input name="capacity_kw" placeholder="Capacity (kW)" value={form.capacity_kw} onChange={handleChange} className="input" required type="number" min="1" />
          <input name="panel_brand" placeholder="Panel Brand" value={form.panel_brand} onChange={handleChange} className="input" required />
          <input name="inverter_brand" placeholder="Inverter Brand" value={form.inverter_brand} onChange={handleChange} className="input" required />
          <input name="cable_brand" placeholder="Cable Brand" value={form.cable_brand} onChange={handleChange} className="input" required />
          <input name="cable_length_included" placeholder="Cable Length Included (meters)" value={form.cable_length_included} onChange={handleChange} className="input" required type="number" min="0" />
          <textarea name="component_pricing" placeholder='Component Pricing (JSON: {"panel":10000,"inverter":5000})' value={form.component_pricing} onChange={handleChange} className="input" required />
          <input name="total_price" placeholder="Total Price" value={form.total_price} onChange={handleChange} className="input" required type="number" min="0" />
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
  );
} 