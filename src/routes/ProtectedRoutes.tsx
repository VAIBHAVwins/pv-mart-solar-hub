
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';

const ProtectedRoutes = () => {
  const { authState } = useAuth();

  if (!authState?.isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      {/* Protected routes can be added here as needed */}
      <Route path="*" element={<div>Protected Content</div>} />
    </Routes>
  );
};

export default ProtectedRoutes;
