
import AdminSidebar from './AdminSidebar';
import CustomerManagement from './CustomerManagement';

const AdminCustomerManager = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <CustomerManagement />
      </div>
    </div>
  );
};

export default AdminCustomerManager;
