import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

function BannerAdmin() {
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
      <div className="mb-6">
        <input name="title" placeholder="Title" value={form.title} onChange={handleInputChange} className="border rounded px-2 py-1 mr-2" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleInputChange} className="border rounded px-2 py-1 mr-2" />
        <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleInputChange} className="border rounded px-2 py-1 mr-2" />
        <Button onClick={editingBanner ? handleUpdate : handleAdd} className="bg-solar-primary text-white px-4 py-2 rounded">
          {editingBanner ? 'Update' : 'Add'}
        </Button>
        {editingBanner && <Button onClick={() => { setEditingBanner(null); setForm({ title: '', description: '', image_url: '', order_index: 0, is_active: true }); }} className="ml-2">Cancel</Button>}
      </div>
      {loading ? <div>Loading banners...</div> : error ? <div className="text-red-500">{error}</div> : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-solar-primary text-white">
              <th className="p-2">Order</th>
              <th className="p-2">Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Image</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, idx) => (
              <tr key={banner.id} className="border-b">
                <td className="p-2">
                  <button onClick={() => handleReorder(idx, idx - 1)} disabled={idx === 0}>↑</button>
                  <button onClick={() => handleReorder(idx, idx + 1)} disabled={idx === banners.length - 1}>↓</button>
                </td>
                <td className="p-2">{banner.title}</td>
                <td className="p-2">{banner.description}</td>
                <td className="p-2"><img src={banner.image_url} alt={banner.title} className="w-24 h-12 object-cover rounded" /></td>
                <td className="p-2">{banner.is_active ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <Button onClick={() => handleEdit(banner)} className="mr-2">Edit</Button>
                  <Button onClick={() => handleDelete(banner.id)} variant="destructive">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function BannerDashboard() {
  // const { user, loading: authLoading } = useSupabaseAuth();
  // const navigate = useNavigate();
  // const [checking, setChecking] = useState(true);
  // const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   const checkAdmin = async () => {
  //     if (!user && !authLoading) {
  //       navigate('/admin/login');
  //       return;
  //     }
  //     if (user) {
  //       const { data: roles } = await supabase
  //         .from('user_roles')
  //         .select('role')
  //         .eq('user_id', user.id)
  //         .eq('role', 'admin');
  //       if (roles && roles.length > 0) {
  //         setIsAdmin(true);
  //       } else {
  //         navigate('/admin/login');
  //       }
  //     }
  //     setChecking(false);
  //   };
  //   checkAdmin();
  // }, [user, authLoading, navigate]);

  // if (checking) {
  //   return <div className="flex items-center justify-center min-h-screen">Checking admin access...</div>;
  // }
  // if (!isAdmin) return null;

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Banner Dashboard</h1>
      <BannerAdmin />
    </div>
  );
} 