
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useVendorQuotationForm } from '@/hooks/useVendorQuotationForm';
import { VendorInfoSection } from '@/components/vendor/VendorInfoSection';
import { ComponentsSection } from '@/components/vendor/ComponentsSection';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { SupabaseAuthForm } from '@/components/auth/SupabaseAuthForm';

export default function SupabaseQuotationForm() {
  const { user } = useSupabaseAuth();
  const {
    formData,
    setFormData,
    components,
    addComponent,
    removeComponent,
    updateComponent,
    calculateTotalPrice,
    handleSubmit,
    loading
  } = useVendorQuotationForm();

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#797a83] to-[#4f4f56] py-8 px-4">
          <div className="container mx-auto max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
              <p className="text-gray-300">Please log in to submit a quotation</p>
            </div>
            <SupabaseAuthForm />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#797a83] to-[#4f4f56] py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-[#f7f7f6] shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#797a83] text-center">
                Vendor Quotation Form
              </CardTitle>
              <p className="text-center text-gray-600">Logged in as: {user.email}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <VendorInfoSection formData={formData} setFormData={setFormData} />

                <ComponentsSection 
                  components={components}
                  addComponent={addComponent}
                  removeComponent={removeComponent}
                  updateComponent={updateComponent}
                />

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-[#797a83] mb-4">
                    Total Quotation: ₹{calculateTotalPrice().toFixed(2)}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#b07e66] hover:bg-[#797a83] px-8 py-2"
                  >
                    {loading ? 'Submitting...' : 'Submit Quotation'}
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
