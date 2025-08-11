
import AdminSidebar from './AdminSidebar';
import QuotationsManagement from './QuotationsManagement';

const AdminQuotationManager = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <QuotationsManagement />
      </div>
    </div>
  );
};

export default AdminQuotationManager;
