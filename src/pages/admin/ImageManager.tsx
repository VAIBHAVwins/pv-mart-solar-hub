// ENHANCED BY CURSOR AI: Admin image management page (upload/list/delete images)
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const storage = getStorage();

export default function ImageManager() {
  const [images, setImages] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'images'));
        setImages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err: any) {
        setError(err.message || 'Failed to load images.');
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [success]);

  const handleUpload = async () => {
    if (!file) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const storageRef = ref(storage, `siteImages/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'images'), { url, name: file.name, uploadedAt: new Date().toISOString() });
      setFile(null);
      setSuccess('Image uploaded!');
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (img: any) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const storageRef = ref(storage, `siteImages/${img.name}`);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'images', img.id));
      setSuccess('Image deleted!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#444e59]">Image Management</h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600 font-semibold text-center mb-4">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-center mb-4">{success}</div>}
        <div className="mb-4 flex gap-2 items-center">
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
          <Button onClick={handleUpload} className="bg-[#589bee] hover:bg-[#5279ac] text-white font-semibold" disabled={loading || !file}>Upload</Button>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Uploaded Images</h2>
          {images.map(img => (
            <div key={img.id} className="border rounded p-2 mb-2 flex justify-between items-center">
              <a href={img.url} target="_blank" rel="noopener noreferrer" className="text-[#589bee] hover:underline">{img.name}</a>
              <Button onClick={() => handleDelete(img)} className="bg-red-500 hover:bg-red-600 text-white font-semibold" disabled={loading}>Delete</Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 