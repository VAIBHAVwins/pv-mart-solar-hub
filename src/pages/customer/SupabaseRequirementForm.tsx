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
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupabaseRequirementForm() {
  const { user } = useAuth();
  const { formData, setFormData, loading, handleSubmit, analysisResult, resultRef } = useCustomerRequirementForm();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!user) {
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

  const handleConnectVendor = () => {
    setShowPopup(true);
    popupTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
      navigate('/');
    }, 15000);
  };

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
                Logged in as: {user.email}
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
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-[#8b4a08]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : 'Submit Requirement'}
                  </Button>
                </div>
              </form>

              {/* Analysis Result Section */}
              {analysisResult && (
                <div ref={resultRef} className="mt-10 p-6 bg-yellow-50 rounded-lg shadow-inner text-center">
                  <h2 className="text-xl font-bold text-[#8b4a08] mb-2">Analysis Result</h2>
                  <p className="text-lg mb-2">Estimated number of solar panels required: <span className="font-bold text-[#f8b200]">{analysisResult.panelCount}</span></p>
                  {analysisResult.bestQuotation && (
                    <div className="mb-2">
                      <p className="text-gray-700">Best Vendor Quotation: <span className="font-semibold">₹{analysisResult.bestQuotation.total_price}</span></p>
                      <p className="text-gray-600 text-sm">Vendor: {analysisResult.bestQuotation.vendor_name}</p>
                    </div>
                  )}
                  <Button
                    className="mt-4 bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] px-6 py-2 font-bold"
                    onClick={handleConnectVendor}
                  >
                    Connect me to a vendor
                  </Button>
                </div>
              )}
              {/* Popup Message */}
              {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h3 className="text-2xl font-bold mb-4 text-[#8b4a08]">Thank you for showing your interest</h3>
                    <p className="text-lg text-gray-700 mb-2">Our team will contact you soon.</p>
                    <p className="text-sm text-gray-500">You will be redirected to the homepage shortly.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
