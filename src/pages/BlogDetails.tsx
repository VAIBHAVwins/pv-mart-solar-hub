// ENHANCED BY CURSOR AI: Public blog detail page
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Layout from '@/components/layout/Layout';
import { useParams } from 'react-router-dom';

// CURSOR AI: Modern, professional Blog Details redesign with common color palette and UI patterns
export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'blogPosts', id!));
        if (snap.exists()) setPost(snap.data());
        else setError('Post not found.');
      } catch (err: any) {
        setError(err.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6fafd] py-16 px-4">
        <div className="w-full max-w-2xl">
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
          {post && (
            <div className="bg-white rounded-xl shadow-lg p-10 animate-fade-in">
              <h1 className="text-3xl font-extrabold mb-4 text-[#444e59] drop-shadow">{post.title}</h1>
              <div className="text-xs text-gray-500 mb-6">{post.createdAt}</div>
              <div className="prose prose-lg max-w-none text-[#444e59]">{post.content}</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 