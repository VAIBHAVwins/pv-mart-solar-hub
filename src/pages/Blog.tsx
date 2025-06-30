// ENHANCED BY CURSOR AI: Public blog listing page
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

// CURSOR AI: Modern, professional Blog Listing redesign with common color palette and UI patterns
export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6fafd] py-16 px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-[#444e59] drop-shadow-lg">Solar Blog</h1>
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                <Link to={`/blog/${post.id}`} className="font-extrabold text-[#589bee] hover:underline text-2xl mb-2 block transition-colors">{post.title}</Link>
                <div className="text-xs text-gray-500 mb-2">{post.createdAt}</div>
                <div className="text-[#444e59] line-clamp-3 mb-2">{post.content?.slice(0, 180)}{post.content && post.content.length > 180 ? '...' : ''}</div>
                <Link to={`/blog/${post.id}`} className="inline-block mt-2 text-[#5279ac] hover:text-[#589bee] font-semibold underline transition">Read More</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 