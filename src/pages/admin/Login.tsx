
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to admin dashboard since no auth is required
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default AdminLogin;
