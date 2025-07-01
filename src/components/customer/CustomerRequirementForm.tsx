import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CustomerRequirementForm({ onClose }: { onClose: () => void }) {
  const { user } = useSupabaseAuth();
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a requirement.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const { data, error } = await supabase.from('customer_requirements').insert([
        {
          customer_id: user.id,
          customer_name: form.customer_name,
          customer_email: user.email!,
          customer_phone: form.customer_phone,
          installation_type: form.installation_type as any,
          system_type: form.system_type as any,
          property_type: form.property_type,
          roof_type: form.roof_type,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          monthly_bill: parseFloat(form.monthly_bill) || null,
          timeline: form.timeline,
          budget_range: form.budget_range,
          additional_requirements: form.additional_requirements
        }
      ]).select();

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Customer Requirement Form</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Requirement submitted successfully!</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_name">Name *</Label>
              <Input
                id="customer_name"
                value={form.customer_name}
                onChange={(e) => handleChange('customer_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="customer_phone">Phone</Label>
              <Input
                id="customer_phone"
                value={form.customer_phone}
                onChange={(e) => handleChange('customer_phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="installation_type">Installation Type *</Label>
              <Select value={form.installation_type} onValueChange={(value) => handleChange('installation_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1KW">1KW</SelectItem>
                  <SelectItem value="2KW">2KW</SelectItem>
                  <SelectItem value="3KW">3KW</SelectItem>
                  <SelectItem value="4KW">4KW</SelectItem>
                  <SelectItem value="5KW">5KW</SelectItem>
                  <SelectItem value="6KW">6KW</SelectItem>
                  <SelectItem value="7KW">7KW</SelectItem>
                  <SelectItem value="8KW">8KW</SelectItem>
                  <SelectItem value="9KW">9KW</SelectItem>
                  <SelectItem value="10KW">10KW</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="system_type">System Type *</Label>
              <Select value={form.system_type} onValueChange={(value) => handleChange('system_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-grid">On-Grid</SelectItem>
                  <SelectItem value="off-grid">Off-Grid</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_type">Property Type *</Label>
              <Input
                id="property_type"
                value={form.property_type}
                onChange={(e) => handleChange('property_type', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="roof_type">Roof Type *</Label>
              <Input
                id="roof_type"
                value={form.roof_type}
                onChange={(e) => handleChange('roof_type', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={form.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly_bill">Monthly Bill (₹)</Label>
              <Input
                id="monthly_bill"
                type="number"
                value={form.monthly_bill}
                onChange={(e) => handleChange('monthly_bill', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={form.timeline}
                onChange={(e) => handleChange('timeline', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="budget_range">Budget Range</Label>
            <Input
              id="budget_range"
              value={form.budget_range}
              onChange={(e) => handleChange('budget_range', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="additional_requirements">Additional Requirements</Label>
            <Textarea
              id="additional_requirements"
              value={form.additional_requirements}
              onChange={(e) => handleChange('additional_requirements', e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Requirement'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
