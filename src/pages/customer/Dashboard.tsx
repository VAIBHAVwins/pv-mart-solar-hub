import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// ENHANCED BY CURSOR AI: Protected customer dashboard
export default function CustomerDashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Dashboard</h1>
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <p className="mb-4">Welcome, <span className="font-semibold">{user.email}</span></p>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 