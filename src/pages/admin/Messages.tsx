
// ENHANCED BY CURSOR AI: Admin messaging page with static content display
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function AdminMessages() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#444e59]">Admin Messages</h1>
        <div className="text-center text-gray-600 mb-6">
          <p>Messaging functionality requires additional database setup.</p>
          <p>This feature is currently unavailable but will be implemented with proper database schema.</p>
        </div>
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-4">Messaging Features:</h2>
          <ul className="space-y-2">
            <li>• Send Messages to Users</li>
            <li>• Receive Messages from Customers</li>
            <li>• Receive Messages from Vendors</li>
            <li>• Message Threading</li>
            <li>• Message Status Tracking</li>
          </ul>
        </div>
        <div className="mt-6 text-center">
          <Button disabled className="bg-gray-400 text-white">
            Messaging System Coming Soon
          </Button>
        </div>
      </div>
    </Layout>
  );
}
