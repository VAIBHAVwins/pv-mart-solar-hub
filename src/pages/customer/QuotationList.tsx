import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function QuotationList() {
  const { user } = useSupabaseAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchQuotations();
    }
  }, [user]);

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_quotations')
        .select(`
          *,
          quotation_components (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
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
                <p className="text-gray-600">Please log in to view quotations.</p>
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
                <p className="text-gray-600">Loading quotations...</p>
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
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#8b4a08] text-center">
                Available Quotations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No quotations available at the moment.</p>
                  <Link to="/customer/supabase-requirement">
                    <Button className="bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] px-8 py-2 font-bold">
                      Submit a Requirement
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {quotations.map((quotation) => (
                    <Card key={quotation.id} className="border-2 border-[#fecb00]">
                      <CardHeader>
                        <CardTitle className="text-lg text-[#8b4a08]">
                          {quotation.vendor_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p><strong>System:</strong> {quotation.system_type}</p>
                        <p><strong>Type:</strong> {quotation.installation_type}</p>
                        <p className="text-xl font-bold text-[#8b4a08]">
                          ₹{quotation.total_price.toLocaleString()}
                        </p>
                        {quotation.warranty_years && (
                          <p><strong>Warranty:</strong> {quotation.warranty_years} years</p>
                        )}
                        <div className="pt-4">
                          <Link to={`/customer/quotation/${quotation.id}`}>
                            <Button className="w-full bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] font-bold">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
