import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function VendorQuotationForm({ onClose }: { onClose: () => void }) {
  const { user } = useSupabaseAuth();
  const [form, setForm] = useState({
    vendor_name: '',
    vendor_phone: '',
    installation_type: '',
    system_type: '',
    total_price: '',
    installation_charge: '',
    warranty_years: '',
    description: ''
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
      setError('You must be logged in to submit a quotation.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const { data, error } = await supabase.from('vendor_quotations').insert([
        {
          vendor_id: user.id,
          vendor_name: form.vendor_name,
          vendor_email: user.email!,
          vendor_phone: form.vendor_phone,
          installation_type: form.installation_type as any,
          system_type: form.system_type as any,
          total_price: parseFloat(form.total_price),
          installation_charge: parseFloat(form.installation_charge) || null,
          warranty_years: parseInt(form.warranty_years) || null,
          description: form.description
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
        <h2 className="text-2xl font-bold mb-4">Vendor Quotation Form</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Quotation submitted successfully!</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor_name">Vendor Name *</Label>
              <Input
                id="vendor_name"
                value={form.vendor_name}
                onChange={(e) => handleChange('vendor_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="vendor_phone">Phone</Label>
              <Input
                id="vendor_phone"
                value={form.vendor_phone}
                onChange={(e) => handleChange('vendor_phone', e.target.value)}
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
              <Label htmlFor="total_price">Total Price (₹) *</Label>
              <Input
                id="total_price"
                type="number"
                value={form.total_price}
                onChange={(e) => handleChange('total_price', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="installation_charge">Installation Charge (₹)</Label>
              <Input
                id="installation_charge"
                type="number"
                value={form.installation_charge}
                onChange={(e) => handleChange('installation_charge', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="warranty_years">Warranty (Years)</Label>
            <Input
              id="warranty_years"
              type="number"
              value={form.warranty_years}
              onChange={(e) => handleChange('warranty_years', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Quotation'}
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
