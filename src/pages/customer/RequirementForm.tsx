
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

export default function RequirementForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Property Details
    address: '',
    city: '',
    state: '',
    pincode: '',
    roofType: '',
    roofArea: '',
    shadingIssues: '',
    
    // Energy Requirements
    monthlyBill: '',
    dailyUsage: '',
    systemSize: '',
    gridConnection: '',
    
    // Project Details
    budget: '',
    timeline: '',
    installation: '',
    maintenance: '',
    
    // Contact Preferences
    preferredContact: '',
    bestTime: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would typically save to database
      console.log('Quote request submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to dashboard with success message
      navigate('/customer/dashboard?quote=submitted');
    } catch (error) {
      console.error('Error submitting quote request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/customer/login');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#fff8e1] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#8b4a08] mb-2">Solar Requirements Form</h1>
            <p className="text-[#52796f] mb-8">Tell us about your solar project requirements and we'll connect you with the best vendors.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Property Details Section */}
              <div className="bg-[#fff8e1] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-[#8b4a08] mb-4">Property Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Property Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete property address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="roofType">Roof Type</Label>
                    <Select onValueChange={(value) => handleInputChange('roofType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete">Concrete Flat Roof</SelectItem>
                        <SelectItem value="tile">Tile Roof</SelectItem>
                        <SelectItem value="metal">Metal Roof</SelectItem>
                        <SelectItem value="asbestos">Asbestos Sheet</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roofArea">Available Roof Area (sq ft)</Label>
                    <Input
                      id="roofArea"
                      type="number"
                      value={formData.roofArea}
                      onChange={(e) => handleInputChange('roofArea', e.target.value)}
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>
              </div>

              {/* Energy Requirements Section */}
              <div className="bg-[#f0f8ff] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-[#0895c6] mb-4">Energy Requirements</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyBill">Monthly Electricity Bill (₹)</Label>
                    <Input
                      id="monthlyBill"
                      type="number"
                      value={formData.monthlyBill}
                      onChange={(e) => handleInputChange('monthlyBill', e.target.value)}
                      placeholder="e.g., 3000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyUsage">Daily Energy Usage (kWh)</Label>
                    <Input
                      id="dailyUsage"
                      type="number"
                      value={formData.dailyUsage}
                      onChange={(e) => handleInputChange('dailyUsage', e.target.value)}
                      placeholder="e.g., 15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="systemSize">Preferred System Size</Label>
                    <Select onValueChange={(value) => handleInputChange('systemSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1kw">1 kW</SelectItem>
                        <SelectItem value="2kw">2 kW</SelectItem>
                        <SelectItem value="3kw">3 kW</SelectItem>
                        <SelectItem value="5kw">5 kW</SelectItem>
                        <SelectItem value="10kw">10 kW</SelectItem>
                        <SelectItem value="custom">Custom Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gridConnection">Grid Connection Type</Label>
                    <Select onValueChange={(value) => handleInputChange('gridConnection', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select connection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-grid">On-Grid (Grid-Tied)</SelectItem>
                        <SelectItem value="off-grid">Off-Grid (Standalone)</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Battery Backup)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Project Details Section */}
              <div className="bg-[#f5f5f5] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-[#444e59] mb-4">Project Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget Range (₹)</Label>
                    <Select onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="1l-2l">₹1,00,000 - ₹2,00,000</SelectItem>
                        <SelectItem value="2l-5l">₹2,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="5l+">₹5,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1month">Within 1 month</SelectItem>
                        <SelectItem value="3months">Within 3 months</SelectItem>
                        <SelectItem value="6months">Within 6 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Preferences */}
              <div className="bg-[#fff8f0] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-[#8b4a08] mb-4">Contact Preferences</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                    <Select onValueChange={(value) => handleInputChange('preferredContact', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How should we contact you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="visit">Site Visit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bestTime">Best Time to Contact</Label>
                    <Select onValueChange={(value) => handleInputChange('bestTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select best time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="additionalNotes">Additional Notes or Special Requirements</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] px-8 py-3 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Requirements'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
