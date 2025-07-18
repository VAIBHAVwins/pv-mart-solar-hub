
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Quotation {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  installation_type: string;
  system_type: string;
  total_price: number;
  installation_charge: number;
  warranty_years: number;
  description: string;
  created_at: string;
}

const QuotationsManagement = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Quotation | null>(null);
  const [editForm, setEditForm] = useState<Partial<Quotation>>({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchQuotations = async () => {
    setLoading(true);
    const { data: quotationsData } = await supabase
      .from('vendor_quotations')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Fetched quotations:', quotationsData);
    setQuotations(quotationsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const openEdit = (q: Quotation) => {
    setEditing(q);
    setEditForm({ ...q });
  };
  
  const closeEdit = () => {
    setEditing(null);
    setEditForm({});
  };
  
  const handleEditChange = (field: string, value: string | number) => {
    setEditForm({ ...editForm, [field]: value });
  };
  
  const saveEdit = async () => {
    if (!editing) return;
    setEditLoading(true);
    await supabase.from('vendor_quotations').update({
      vendor_name: editForm.vendor_name,
      vendor_email: editForm.vendor_email,
      vendor_phone: editForm.vendor_phone,
      installation_type: editForm.installation_type,
      system_type: editForm.system_type,
      total_price: editForm.total_price,
      installation_charge: editForm.installation_charge,
      warranty_years: editForm.warranty_years,
      description: editForm.description,
    }).eq('id', editing.id);
    setEditLoading(false);
    closeEdit();
    fetchQuotations();
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this quotation?')) return;
    setLoading(true);
    await supabase.from('vendor_quotations').delete().eq('id', id);
    fetchQuotations();
  };
  
  const handleDownloadCSV = () => {
    const csv = [
      ['Vendor Name', 'Email', 'Phone', 'Installation Type', 'System Type', 'Total Price', 'Created At'],
      ...quotations.map(q => [q.vendor_name, q.vendor_email, q.vendor_phone, q.installation_type, q.system_type, q.total_price, q.created_at])
    ].map(row => row.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const installationTypes = ['rooftop', 'ground_mounted', 'carport', 'other'];
  const systemTypes = ['on_grid', 'off_grid', 'hybrid'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quotations Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={fetchQuotations} disabled={loading}>Refresh</Button>
          <Button onClick={handleDownloadCSV} disabled={loading}>Download CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Vendor Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Installation Type</th>
                <th className="text-left p-2">System Type</th>
                <th className="text-left p-2">Total Price</th>
                <th className="text-left p-2">Created At</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map(q => (
                <tr key={q.id} className="border-b">
                  <td className="p-2">{q.vendor_name}</td>
                  <td className="p-2">{q.vendor_email}</td>
                  <td className="p-2">{q.vendor_phone}</td>
                  <td className="p-2">{q.installation_type}</td>
                  <td className="p-2">{q.system_type}</td>
                  <td className="p-2">{q.total_price}</td>
                  <td className="p-2">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td className="p-2">
                    <Button size="sm" onClick={() => openEdit(q)} className="mr-2">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && quotations.length === 0 && <div className="text-center py-4">No quotations found.</div>}
        
        <Dialog open={!!editing} onOpenChange={closeEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Quotation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input 
                value={editForm.vendor_name || ''} 
                onChange={(e) => handleEditChange('vendor_name', e.target.value)} 
                placeholder="Vendor Name" 
              />
              <Input 
                value={editForm.vendor_email || ''} 
                onChange={(e) => handleEditChange('vendor_email', e.target.value)} 
                placeholder="Email" 
              />
              <Input 
                value={editForm.vendor_phone || ''} 
                onChange={(e) => handleEditChange('vendor_phone', e.target.value)} 
                placeholder="Phone" 
              />
              <Select value={editForm.installation_type || ''} onValueChange={(value) => handleEditChange('installation_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Installation Type" />
                </SelectTrigger>
                <SelectContent>
                  {installationTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={editForm.system_type || ''} onValueChange={(value) => handleEditChange('system_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="System Type" />
                </SelectTrigger>
                <SelectContent>
                  {systemTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                type="number"
                value={editForm.total_price || ''} 
                onChange={(e) => handleEditChange('total_price', parseFloat(e.target.value))} 
                placeholder="Total Price" 
              />
              <Input 
                type="number"
                value={editForm.installation_charge || ''} 
                onChange={(e) => handleEditChange('installation_charge', parseFloat(e.target.value))} 
                placeholder="Installation Charge" 
              />
              <Input 
                type="number"
                value={editForm.warranty_years || ''} 
                onChange={(e) => handleEditChange('warranty_years', parseInt(e.target.value))} 
                placeholder="Warranty Years" 
              />
              <Input 
                value={editForm.description || ''} 
                onChange={(e) => handleEditChange('description', e.target.value)} 
                placeholder="Description" 
              />
            </div>
            <DialogFooter>
              <Button onClick={saveEdit} disabled={editLoading}>Save</Button>
              <Button variant="secondary" onClick={closeEdit}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuotationsManagement;
