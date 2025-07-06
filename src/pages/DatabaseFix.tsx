import { useState } from 'react';
import { fixDatabaseSchema, testRegistration } from '@/lib/fix-database';
import { Button } from '@/components/ui/button';

export default function DatabaseFix() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');

  const handleFixDatabase = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const fixResult = await fixDatabaseSchema();
      if (fixResult.success) {
        setResult('✅ Database schema fixed successfully!');
      } else {
        setResult(`❌ Database fix failed: ${fixResult.error?.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestCustomerRegistration = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      const testData = {
        email: `test-customer-${Date.now()}@example.com`,
        password: 'testpassword123',
        name: 'Test Customer',
        phone: '+919876543210',
        userType: 'customer' as const
      };
      
      const testResult = await testRegistration(testData);
      if (testResult.success) {
        setTestResult(`✅ Customer registration test successful! User ID: ${testResult.user?.id}`);
      } else {
        setTestResult(`❌ Customer registration test failed: ${testResult.error?.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestVendorRegistration = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      const testData = {
        email: `test-vendor-${Date.now()}@example.com`,
        password: 'testpassword123',
        name: 'Test Vendor',
        phone: '+919876543211',
        userType: 'vendor' as const,
        companyName: 'Test Solar Company'
      };
      
      const testResult = await testRegistration(testData);
      if (testResult.success) {
        setTestResult(`✅ Vendor registration test successful! User ID: ${testResult.user?.id}`);
      } else {
        setTestResult(`❌ Vendor registration test failed: ${testResult.error?.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Database Fix Tool
        </h1>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Step 1: Fix Database Schema
            </h2>
            <p className="text-blue-700 mb-4">
              This will add the missing phone column to the profiles table and update the trigger function.
            </p>
            <Button
              onClick={handleFixDatabase}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Fixing Database...' : 'Fix Database Schema'}
            </Button>
            {result && (
              <div className={`mt-4 p-3 rounded ${result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {result}
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Step 2: Test Customer Registration
            </h2>
            <p className="text-green-700 mb-4">
              Test if customer registration works with the fixed database.
            </p>
            <Button
              onClick={handleTestCustomerRegistration}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Testing...' : 'Test Customer Registration'}
            </Button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-800 mb-2">
              Step 3: Test Vendor Registration
            </h2>
            <p className="text-purple-700 mb-4">
              Test if vendor registration works with the fixed database.
            </p>
            <Button
              onClick={handleTestVendorRegistration}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Testing...' : 'Test Vendor Registration'}
            </Button>
          </div>

          {testResult && (
            <div className={`p-4 rounded ${testResult.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <h3 className="font-semibold mb-2">Test Result:</h3>
              {testResult}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• This tool uses admin privileges to fix the database</li>
            <li>• Test users are created with confirmed emails</li>
            <li>• Check the browser console for detailed logs</li>
            <li>• Remove this page after fixing the issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 