// ENHANCED BY CURSOR AI: Customer messaging page (send/receive messages)
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function CustomerMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      try {
        const q = query(collection(db, 'messages'), where('to', '==', user?.uid), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setMessages(snap.docs.map(doc => doc.data()));
      } catch (err: any) {
        setError(err.message || 'Failed to load messages.');
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchMessages();
  }, [user]);

  const handleSend = async () => {
    if (!newMsg) return;
    setError('');
    try {
      await addDoc(collection(db, 'messages'), {
        from: user?.uid,
        fromEmail: user?.email,
        to: 'admin', // CURSOR AI: For demo, send to admin
        message: newMsg,
        createdAt: Timestamp.now(),
      });
      setNewMsg('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#444e59]">Messages</h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
        <div className="space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className="border rounded p-2">
              <div className="text-xs text-gray-500 mb-1">From: {msg.fromEmail || msg.from}</div>
              <div>{msg.message}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="Type a message..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
          />
          <Button onClick={handleSend} className="bg-[#589bee] hover:bg-[#5279ac] text-white font-semibold">Send</Button>
        </div>
      </div>
    </Layout>
  );
} 