import { useState, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/contexts/AuthContext';

export default function VendorQuotationForm({ onClose }: { onClose: () => void }) {
  const { user } = useContext(AuthContext);
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
    if (!user) {
      setError('You must be logged in to submit a quotation.');
      setPopupMessage('You must be logged in to submit a quotation.');
      setShowPopup(true);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    setVerifying(false);
    try {
      const { data, error } = await supabase.from('vendor_quotations').insert([
        {
          vendor_id: user.uid || user.email,
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
} 