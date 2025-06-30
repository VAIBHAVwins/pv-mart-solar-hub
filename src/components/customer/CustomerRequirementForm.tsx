import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function CustomerRequirementForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    system_type: '',
    capacity_kw: '',
    preferred_panel_brand: '',
    preferred_inverter_brand: '',
    preferred_cable_brand: '',
    other_preferences: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [requirementId, setRequirementId] = useState<string | null>(null);
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
    setMatches([]);
    setVerifying(false);
    try {
      // Insert requirement
      const { data, error } = await supabase.from('customer_requirements').insert([
        {
          system_type: form.system_type,
          capacity_kw: Number(form.capacity_kw),
          preferred_panel_brand: form.preferred_panel_brand,
          preferred_inverter_brand: form.preferred_inverter_brand,
          preferred_cable_brand: form.preferred_cable_brand,
          other_preferences: form.other_preferences,
        },
      ]).select();
      if (error || !data || !data[0]?.id) throw error || new Error('Submission failed');
      setRequirementId(data[0]?.id);
      setVerifying(true);
      // Verification protocol: 3s for fast, 10s for max
      const verifyPromise = supabase.from('customer_requirements').select('*').eq('id', data[0].id).single();
      const timeout3s = new Promise((_, reject) => setTimeout(() => reject(new Error('Verification taking longer than expected...')), 3000));
      const timeout10s = new Promise((_, reject) => setTimeout(() => reject(new Error('Verification timed out')), 10000));
      let verifyData, verifyError;
      try {
        ({ data: verifyData, error: verifyError } = await Promise.race([verifyPromise, timeout3s]));
        if (verifyError || !verifyData) throw verifyError || new Error('Verification failed');
        setSuccess(true);
        setPopupMessage('Requirement submitted and verified successfully!');
        setShowPopup(true);
        setTimeout(() => { setShowPopup(false); onClose(); }, 2000);
      } catch (e) {
        // If 3s passed, show loader and wait up to 10s
        try {
          ({ data: verifyData, error: verifyError } = await Promise.race([verifyPromise, timeout10s]));
          if (verifyError || !verifyData) throw verifyError || new Error('Verification failed');
          setSuccess(true);
          setPopupMessage('Requirement submitted and verified successfully!');
          setShowPopup(true);
          setTimeout(() => { setShowPopup(false); onClose(); }, 2000);
        } catch (e2) {
          setError(e2.message || 'Verification failed');
          setPopupMessage('Failed to submit or verify requirement.');
          setShowPopup(true);
        }
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
      setPopupMessage('Failed to submit or verify requirement.');
      setShowPopup(true);
      setLoading(false);
    }
  };

  const handleConnect = async (quotationId: string) => {
    if (!requirementId) return;
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.from('customer_requirements').update({ status: 'matched' }).eq('id', requirementId);
      if (error) throw error;
      setPopupMessage('Vendor will be notified!');
      setShowPopup(true);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
      setPopupMessage('Failed to connect to vendor.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  if (matches.length > 0) {
    return (
      <>
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow text-center">
              <div className="text-lg font-bold mb-2">{popupMessage}</div>
              <button className="btn btn-primary mt-2" onClick={() => setShowPopup(false)}>OK</button>
            </div>
          </div>
        )}
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-bold mb-2">Matching Vendor Quotations</h2>
            {matches.map((q, i) => (
              <div key={q.id || i} className="border rounded p-4 mb-4 text-left">
                <div><b>System:</b> {q.system_type} | <b>Capacity:</b> {q.capacity_kw} kW</div>
                <div><b>Panel:</b> {q.panel_brand} | <b>Inverter:</b> {q.inverter_brand} | <b>Cable:</b> {q.cable_brand}</div>
                <div><b>Cable Length Included:</b> {q.cable_length_included} m</div>
                <div><b>Component Pricing:</b> <pre className="inline">{JSON.stringify(q.component_pricing, null, 2)}</pre></div>
                <div><b>Total Price:</b> ₹{q.total_price}</div>
                <button className="btn btn-primary mt-2" onClick={() => handleConnect(q.id)} disabled={loading}>Connect me to a vendor</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </>
    );
  }

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
            <button className="btn btn-primary mt-2" onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4">
          <h2 className="text-xl font-bold mb-2">Submit Your Requirement</h2>
          <input name="system_type" placeholder="System Type (ongrid/offgrid/hybrid)" value={form.system_type} onChange={handleChange} className="input" required />
          <input name="capacity_kw" placeholder="Capacity (kW)" value={form.capacity_kw} onChange={handleChange} className="input" required type="number" min="1" />
          <input name="preferred_panel_brand" placeholder="Preferred Panel Brand" value={form.preferred_panel_brand} onChange={handleChange} className="input" />
          <input name="preferred_inverter_brand" placeholder="Preferred Inverter Brand" value={form.preferred_inverter_brand} onChange={handleChange} className="input" />
          <input name="preferred_cable_brand" placeholder="Preferred Cable Brand" value={form.preferred_cable_brand} onChange={handleChange} className="input" />
          <textarea name="other_preferences" placeholder="Other Preferences" value={form.other_preferences} onChange={handleChange} className="input" />
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">Submitted! Showing matches...</div>}
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