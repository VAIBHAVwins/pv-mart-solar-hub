
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';

const CustomerRequirements = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Customer requirements:', formData);
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

            <Button 
              type="submit" 
              className="w-full bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] font-semibold text-lg py-3"
            >
              Submit Requirements & Get Quotes
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerRequirements;
