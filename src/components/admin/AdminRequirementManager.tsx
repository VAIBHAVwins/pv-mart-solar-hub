
import AdminSidebar from './AdminSidebar';
import RequirementsManagement from './RequirementsManagement';

const AdminRequirementManager = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <RequirementsManagement />
      </div>
    </div>
  );
};

export default AdminRequirementManager;
