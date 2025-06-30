import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function CustomerRequirementForm({ onClose }: { onClose: () => void }) {
  const { user } = useSupabaseAuth();
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [requirementId, setRequirementId] = useState<string | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a requirement.');
      setPopupMessage('You must be logged in to submit a requirement.');
      setShowPopup(true);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    setMatches([]);
    setVerifying(false);
    try {
      // Insert requirement with Supabase user id/email
      const { data, error } = await supabase.from('customer_requirements').insert([
        {
          customer_id: user?.id || user?.email,
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
} 