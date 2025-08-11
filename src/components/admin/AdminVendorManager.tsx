
import AdminSidebar from './AdminSidebar';
import VendorManagement from './VendorManagement';

const AdminVendorManager = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <VendorManagement />
      </div>
    </div>
  );
};

export default AdminVendorManager;
