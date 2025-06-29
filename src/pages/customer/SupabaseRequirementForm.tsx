
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function SupabaseRequirementForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    installation_type: '',
    system_type: '',
    property_type: '',
    roof_type: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    monthly_bill: '',
    timeline: '',
    budget_range: '',
    additional_requirements: ''
  });

  const installationTypes = ['1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', 'custom'];
  const systemTypes = ['on-grid', 'off-grid', 'hybrid'];
  const propertyTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural'];
  const roofTypes = ['RCC Flat', 'Tin Shed', 'Tile Roof', 'Asbestos', 'Ground Mount'];
  const timelines = ['Within 1 month', '1-3 months', '3-6 months', '6+ months'];
  const budgetRanges = ['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', '₹5,00,000+'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('customer_requirements')
        .insert({
          customer_id: user.uid,
          customer_name: formData.customer_name,
          customer_email: user.email!,
          customer_phone: formData.customer_phone,
          installation_type: formData.installation_type,
          system_type: formData.system_type,
          property_type: formData.property_type,
          roof_type: formData.roof_type,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          monthly_bill: parseFloat(formData.monthly_bill) || null,
          timeline: formData.timeline,
          budget_range: formData.budget_range,
          additional_requirements: formData.additional_requirements
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your requirement has been submitted successfully. Vendors will contact you soon.",
      });

      // Reset form
      setFormData({
        customer_name: '',
        customer_phone: '',
        installation_type: '',
        system_type: '',
        property_type: '',
        roof_type: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        monthly_bill: '',
        timeline: '',
        budget_range: '',
        additional_requirements: ''
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit requirement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#8b4a08] text-center">
                Supabase Customer Requirement Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone Number *</Label>
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* System Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="installation_type">Installation Type *</Label>
                    <Select value={formData.installation_type} onValueChange={(value) => setFormData({...formData, installation_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select installation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {installationTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="system_type">System Type *</Label>
                    <Select value={formData.system_type} onValueChange={(value) => setFormData({...formData, system_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system type" />
                      </SelectTrigger>
                      <SelectContent>
                        {systemTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Property Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select value={formData.property_type} onValueChange={(value) => setFormData({...formData, property_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roof_type">Roof Type *</Label>
                    <Select value={formData.roof_type} onValueChange={(value) => setFormData({...formData, roof_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roofTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthly_bill">Current Monthly Electricity Bill (₹)</Label>
                    <Input
                      id="monthly_bill"
                      type="number"
                      value={formData.monthly_bill}
                      onChange={(e) => setFormData({...formData, monthly_bill: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Preferred Timeline</Label>
                    <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelines.map(timeline => (
                          <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget_range">Budget Range</Label>
                  <Select value={formData.budget_range} onValueChange={(value) => setFormData({...formData, budget_range: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map(range => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additional_requirements">Additional Requirements</Label>
                  <Textarea
                    id="additional_requirements"
                    value={formData.additional_requirements}
                    onChange={(e) => setFormData({...formData, additional_requirements: e.target.value})}
                    rows={3}
                    placeholder="Any specific requirements, preferences, or questions..."
                  />
                </div>

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
