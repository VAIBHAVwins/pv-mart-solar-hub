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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const { error } = await supabase.from('vendor_quotations').insert([
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
      ]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        {success && <div className="text-green-600">Submitted!</div>}
        <div className="flex gap-4 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
} 