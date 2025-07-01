import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function QuotationDetails() {
  const { id } = useParams();
  const { user } = useSupabaseAuth();
  const [quotation, setQuotation] = useState<QuotationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchQuotationDetails();
    }
  }, [user, id]);

  const fetchQuotationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_quotations')
        .select(`
          *,
          quotation_components (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setQuotation(data);
    } catch (error) {
      console.error('Error fetching quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-white shadow-xl">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-[#8b4a08] mb-4">Authentication Required</h1>
                <p className="text-gray-600">Please log in to view quotation details.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-white shadow-xl">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Loading quotation details...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (!quotation) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-white shadow-xl">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-[#8b4a08] mb-4">Quotation Not Found</h1>
                <p className="text-gray-600">The requested quotation could not be found.</p>
              </CardContent>
            </Card>
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
                Quotation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#8b4a08] mb-2">Vendor Information</h3>
                <p><strong>Name:</strong> {quotation.vendor_name}</p>
                <p><strong>Email:</strong> {quotation.vendor_email}</p>
                {quotation.vendor_phone && <p><strong>Phone:</strong> {quotation.vendor_phone}</p>}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#8b4a08] mb-2">System Details</h3>
                <p><strong>Installation Type:</strong> {quotation.installation_type}</p>
                <p><strong>System Type:</strong> {quotation.system_type}</p>
                {quotation.warranty_years && <p><strong>Warranty:</strong> {quotation.warranty_years} years</p>}
              </div>

              {quotation.quotation_components && quotation.quotation_components.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#8b4a08] mb-2">Components</h3>
                  <div className="space-y-4">
                    {quotation.quotation_components.map((component: any, index: number) => (
                      <div key={index} className="border rounded p-4">
                        <p><strong>Type:</strong> {component.component_type}</p>
                        <p><strong>Brand:</strong> {component.brand}</p>
                        {component.model && <p><strong>Model:</strong> {component.model}</p>}
                        <p><strong>Quantity:</strong> {component.quantity}</p>
                        <p><strong>Unit Price:</strong> ₹{component.unit_price}</p>
                        <p><strong>Total:</strong> ₹{component.total_price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-[#8b4a08] mb-2">Pricing</h3>
                {quotation.installation_charge && (
                  <p><strong>Installation Charge:</strong> ₹{quotation.installation_charge}</p>
                )}
                <p className="text-xl font-bold text-[#8b4a08]">
                  <strong>Total Price:</strong> ₹{quotation.total_price}
                </p>
              </div>

              {quotation.description && (
                <div>
                  <h3 className="text-lg font-semibold text-[#8b4a08] mb-2">Description</h3>
                  <p className="text-gray-700">{quotation.description}</p>
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={() => window.history.back()}
                  className="bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] px-8 py-2 font-bold"
                >
                  Back to List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
