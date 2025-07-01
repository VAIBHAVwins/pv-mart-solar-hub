import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerRequirementForm } from '@/hooks/useCustomerRequirementForm';
import { PersonalInfoSection } from '@/components/customer/PersonalInfoSection';
import { SystemRequirementsSection } from '@/components/customer/SystemRequirementsSection';
import { PropertyInfoSection } from '@/components/customer/PropertyInfoSection';
import { AddressSection } from '@/components/customer/AddressSection';
import { AdditionalInfoSection } from '@/components/customer/AdditionalInfoSection';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseAuthForm } from '@/components/auth/SupabaseAuthForm';

export default function SupabaseRequirementForm() {
  const { user, authType } = useAuth();
  const { formData, setFormData, loading, handleSubmit } = useCustomerRequirementForm();

  // Check if user is authenticated (either Firebase or Supabase)
  const isAuthenticated = user && (authType === 'firebase' || authType === 'supabase');

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-8 px-4">
          <div className="container mx-auto max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#8b4a08] mb-2">Authentication Required</h1>
              <p className="text-[#8b4a08]">Please log in to submit a requirement</p>
            </div>
            <SupabaseAuthForm />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#8b4a08] text-center">
                Customer Requirement Form
              </CardTitle>
              <p className="text-center text-gray-600">
                Logged in as: {user.email} ({authType === 'firebase' ? 'Firebase' : 'Supabase'})
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <PersonalInfoSection formData={formData} setFormData={setFormData} />
                <SystemRequirementsSection formData={formData} setFormData={setFormData} />
                <PropertyInfoSection formData={formData} setFormData={setFormData} />
                <AddressSection formData={formData} setFormData={setFormData} />
                <AdditionalInfoSection formData={formData} setFormData={setFormData} />

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] px-8 py-2 font-bold"
                  >
                    {loading ? 'Submitting...' : 'Submit Requirement'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
