// ENHANCED BY CURSOR AI: Admin content management page (edit homepage/about/services)
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function ContentManager() {
  const [content, setContent] = useState({
    homepage: '',
    about: '',
    services: ''
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('site_content').select('*').eq('id', 'main').single();
        if (error) throw error;
        if (data) setContent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load content.');
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { error } = await supabase.from('site_content').upsert({ id: 'main', ...content });
      if (error) throw error;
      setSuccess('Content updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to update content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#444e59]">Content Management</h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-center mb-4">{success}</div>}
        <div className="mb-4">
          <label className="font-semibold">Homepage Content</label>
          <textarea name="homepage" className="border rounded w-full p-2 mt-1" rows={3} value={content.homepage} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label className="font-semibold">About Content</label>
          <textarea name="about" className="border rounded w-full p-2 mt-1" rows={3} value={content.about} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label className="font-semibold">Services Content</label>
          <textarea name="services" className="border rounded w-full p-2 mt-1" rows={3} value={content.services} onChange={handleChange} />
        </div>
        <Button onClick={handleSave} className="bg-[#589bee] hover:bg-[#5279ac] text-white font-semibold" disabled={loading}>Save Content</Button>
      </div>
    </Layout>
  );
} 