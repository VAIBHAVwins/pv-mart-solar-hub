
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Helmet } from 'react-helmet';

const AdminLayout = () => {
  return (
    <>
      <Helmet>
        <title>PVMart Admin - Solar Platform</title>
        <meta name="description" content="PVMart Admin Dashboard - Manage solar platform operations" />
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
