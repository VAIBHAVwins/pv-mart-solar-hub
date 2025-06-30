// ENHANCED BY CURSOR AI: Admin blog manager (create/edit/delete posts)
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function BlogManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('blog_posts').select('*');
        if (error) throw error;
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [success]);

  const handleCreate = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { error } = await supabase.from('blog_posts').insert([
        { title, content, createdAt: new Date().toISOString() },
      ]);
      if (error) throw error;
      setTitle(''); setContent(''); setSuccess('Post created!');
    } catch (err: any) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      setSuccess('Post deleted!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#444e59]">Blog Manager</h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-center mb-4">{success}</div>}
        <div className="mb-4">
          <input className="border rounded w-full p-2 mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="border rounded w-full p-2 mb-2" rows={3} placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
          <Button onClick={handleCreate} className="bg-[#589bee] hover:bg-[#5279ac] text-white font-semibold" disabled={loading}>Create Post</Button>
        </div>
        <div>
          <h2 className="font-semibold mb-2">All Posts</h2>
          {posts.map(post => (
            <div key={post.id} className="border rounded p-2 mb-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{post.title}</div>
                <div className="text-xs text-gray-500">{post.createdAt}</div>
              </div>
              <Button onClick={() => handleDelete(post.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold" disabled={loading}>Delete</Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 