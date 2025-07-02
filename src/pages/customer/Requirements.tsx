import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

const CustomerRequirements = () => {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const [formData, setFormData] = useState({
    capacity: '',
    propertyType: '',
    roofType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    monthlyBill: '',
    timeline: '',
    budget: '',
    additionalRequirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ panelCount: number; estimatedAmount: number } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  let popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();
    setProfile(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);
    // Store requirement in Supabase
    if (user) {
      await supabase.from('customer_requirements').insert({
        customer_id: user.id,
        customer_email: user.email,
        customer_name: profile?.full_name || user.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        property_type: formData.propertyType,
        roof_type: formData.roofType,
        installation_type: formData.capacity,
        system_type: 'on-grid', // or get from form if you add it
        monthly_bill: Number(formData.monthlyBill),
        timeline: formData.timeline,
        budget_range: formData.budget,
        additional_requirements: formData.additionalRequirements,
      });
    }
    // Simulate backend analysis (replace with real logic as needed)
    setTimeout(() => {
      const panelCount = Math.ceil(Number(formData.monthlyBill || 0) / 1000) || 5;
      const estimatedAmount = panelCount * 35000;
      setAnalysisResult({ panelCount, estimatedAmount });
      setLoading(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  const handleConnectVendor = () => {
    setShowPopup(true);
    popupTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
      navigate('/');
    }, 15000);
  };

  return (
    <Layout className="bg-gradient-to-br from-[#fecb00] to-[#f8b200] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#190a02] mb-2">Solar Requirements Form</h1>
            <p className="text-[#8b4a08]">Tell us about your solar needs to get accurate quotations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Solar Capacity */}
            <div>
              <Label htmlFor="capacity" className="text-[#190a02] text-lg font-semibold">Solar System Capacity</Label>
              <select
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-[#8b4a08] rounded-md focus:border-[#fecb00] focus:outline-none"
                required
              >
                <option value="">Select capacity</option>
                <option value="1kw">1 KW</option>
                <option value="2kw">2 KW</option>
                <option value="3kw">3 KW</option>
                <option value="custom">Other (specify in additional requirements)</option>
              </select>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="propertyType" className="text-[#190a02] font-semibold">Property Type</Label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 border border-[#8b4a08] rounded-md focus:border-[#fecb00] focus:outline-none"
                  required
                >
                  <option value="">Select property type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <Label htmlFor="roofType" className="text-[#190a02] font-semibold">Roof Type</Label>
                <select
                  id="roofType"
                  name="roofType"
                  value={formData.roofType}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 border border-[#8b4a08] rounded-md focus:border-[#fecb00] focus:outline-none"
                  required
                >
                  <option value="">Select roof type</option>
                  <option value="concrete">Concrete</option>
                  <option value="metal">Metal Sheet</option>
                  <option value="tile">Tile</option>
                  <option value="ground">Ground Mount</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label className="text-[#190a02] text-lg font-semibold">Installation Location</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete address"
                  className="border-[#8b4a08] focus:border-[#fecb00]"
                  required
                />
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border-[#8b4a08] focus:border-[#fecb00]"
                  required
                />
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="border-[#8b4a08] focus:border-[#fecb00]"
                  required
                />
                <Input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="border-[#8b4a08] focus:border-[#fecb00]"
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="monthlyBill" className="text-[#190a02] font-semibold">Monthly Electricity Bill (₹)</Label>
                <Input
                  id="monthlyBill"
                  name="monthlyBill"
                  type="number"
                  value={formData.monthlyBill}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="mt-2 border-[#8b4a08] focus:border-[#fecb00]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="timeline" className="text-[#190a02] font-semibold">Installation Timeline</Label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 border border-[#8b4a08] rounded-md focus:border-[#fecb00] focus:outline-none"
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Within 1 month</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <Label htmlFor="budget" className="text-[#190a02] font-semibold">Budget Range (₹)</Label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 border border-[#8b4a08] rounded-md focus:border-[#fecb00] focus:outline-none"
                  required
                >
                  <option value="">Select budget</option>
                  <option value="1-3lakhs">₹1-3 Lakhs</option>
                  <option value="3-5lakhs">₹3-5 Lakhs</option>
                  <option value="5-10lakhs">₹5-10 Lakhs</option>
                  <option value="10+lakhs">₹10+ Lakhs</option>
                </select>
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <Label htmlFor="additionalRequirements" className="text-[#190a02] font-semibold">Additional Requirements</Label>
              <textarea
                id="additionalRequirements"
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full p-3 border border-[#8b4a08] rounded-md focus:border-[#fecb00] focus:outline-none"
                placeholder="Any specific requirements, preferences, or questions..."
              />
            </div>

            <div className="text-center">
              <Button type="submit" disabled={loading} className="bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] px-8 py-2 font-bold">
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
              <p className="text-lg mb-2">Welcome <span className="font-bold text-[#3d1604]">{profile?.full_name || user?.email}</span></p>
              <p className="text-lg mb-2">Email: <span className="font-bold text-[#3d1604]">{user?.email}</span></p>
              <div className="my-4 text-left max-w-xl mx-auto">
                <h3 className="font-semibold text-[#8b4a08] mb-2">Your Requirement Details:</h3>
                <ul className="text-[#3d1604] text-base space-y-1">
                  <li><b>Address:</b> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</li>
                  <li><b>Property Type:</b> {formData.propertyType}</li>
                  <li><b>Roof Type:</b> {formData.roofType}</li>
                  <li><b>Capacity:</b> {formData.capacity}</li>
                  <li><b>Monthly Bill:</b> ₹{formData.monthlyBill}</li>
                  <li><b>Timeline:</b> {formData.timeline}</li>
                  <li><b>Budget:</b> {formData.budget}</li>
                  <li><b>Additional Requirements:</b> {formData.additionalRequirements}</li>
                </ul>
              </div>
              <p className="text-lg mb-2">Estimated number of solar panels required: <span className="font-bold text-[#f8b200]">{analysisResult.panelCount}</span></p>
              <p className="text-lg mb-2">Estimated Amount: <span className="font-bold text-[#f8b200]">₹{analysisResult.estimatedAmount}</span></p>
              <Button className="mt-4 bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] px-6 py-2 font-bold" onClick={handleConnectVendor}>
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
        </div>
      </div>
    </Layout>
  );
};

export default CustomerRequirements;
