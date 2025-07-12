import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import BannerForm from './BannerForm';
import BannerTable from './BannerTable';

export default function BannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalInterval, setGlobalInterval] = useState(5000);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', order_index: 0, is_active: true });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) setError('Failed to fetch banners');
    setBanners(data || []);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { error } = await supabase.from('hero_images').insert([{ ...form, order_index: banners.length }]);
    if (error) setError('Failed to add banner');
    else fetchBanners();
    setForm({ title: '', description: '', image_url: '', order_index: 0, is_active: true });
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner.id);
    setForm(banner);
  };

  const handleUpdate = async () => {
    const { error } = await supabase.from('hero_images').update(form).eq('id', editingBanner);
    if (error) setError('Failed to update banner');
    else fetchBanners();
    setEditingBanner(null);
    setForm({ title: '', description: '', image_url: '', order_index: 0, is_active: true });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('hero_images').delete().eq('id', id);
    if (error) setError('Failed to delete banner');
    else fetchBanners();
  };

  const handleReorder = async (from, to) => {
    if (from === to) return;
    const reordered = [...banners];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    for (let i = 0; i < reordered.length; i++) {
      await supabase.from('hero_images').update({ order_index: i }).eq('id', reordered[i].id);
    }
    fetchBanners();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl my-8">
      <h2 className="text-2xl font-bold mb-4 text-solar-primary">Banner Management</h2>
      <div className="mb-4">
        <label className="font-semibold mr-2">Global Banner Interval (ms):</label>
        <input type="number" value={globalInterval} onChange={e => setGlobalInterval(Number(e.target.value))} className="border rounded px-2 py-1 w-32" />
      </div>
      <BannerForm
        form={form}
        onChange={handleInputChange}
        onSubmit={editingBanner ? handleUpdate : handleAdd}
        editing={!!editingBanner}
        onCancel={editingBanner ? () => { setEditingBanner(null); setForm({ title: '', description: '', image_url: '', order_index: 0, is_active: true }); } : undefined}
      />
      {loading ? <div>Loading banners...</div> : error ? <div className="text-red-500">{error}</div> : (
        <BannerTable
          banners={banners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
} 