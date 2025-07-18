
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Requirement {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  installation_type: string;
  system_type: string;
  monthly_bill: number;
  pincode: string;
  created_at: string;
}

const RequirementsManagement = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Requirement | null>(null);
  const [editForm, setEditForm] = useState<Partial<Requirement>>({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchRequirements = async () => {
    setLoading(true);
    const { data: requirementsData } = await supabase
      .from('customer_requirements')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Fetched requirements:', requirementsData);
    setRequirements(requirementsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const openEdit = (r: Requirement) => {
    setEditing(r);
    setEditForm({ ...r });
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
    await supabase.from('customer_requirements').update({
      customer_name: editForm.customer_name,
      customer_email: editForm.customer_email,
      customer_phone: editForm.customer_phone,
      address: editForm.address,
      installation_type: editForm.installation_type,
      system_type: editForm.system_type,
      monthly_bill: editForm.monthly_bill,
      pincode: editForm.pincode,
    }).eq('id', editing.id);
    setEditLoading(false);
    closeEdit();
    fetchRequirements();
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this requirement?')) return;
    setLoading(true);
    await supabase.from('customer_requirements').delete().eq('id', id);
    fetchRequirements();
  };
  
  const handleDownloadCSV = () => {
    const csv = [
      ['Customer Name', 'Email', 'Phone', 'Address', 'Installation Type', 'System Type', 'Monthly Bill', 'Pincode', 'Created At'],
      ...requirements.map(r => [r.customer_name, r.customer_email, r.customer_phone, r.address, r.installation_type, r.system_type, r.monthly_bill, r.pincode, r.created_at])
    ].map(row => row.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requirements.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const installationTypes = ['rooftop', 'ground_mounted', 'carport', 'other'];
  const systemTypes = ['on_grid', 'off_grid', 'hybrid'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Requirements Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={fetchRequirements} disabled={loading}>Refresh</Button>
          <Button onClick={handleDownloadCSV} disabled={loading}>Download CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Customer Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Address</th>
                <th className="text-left p-2">Installation Type</th>
                <th className="text-left p-2">System Type</th>
                <th className="text-left p-2">Monthly Bill</th>
                <th className="text-left p-2">Pincode</th>
                <th className="text-left p-2">Created At</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{r.customer_name}</td>
                  <td className="p-2">{r.customer_email}</td>
                  <td className="p-2">{r.customer_phone}</td>
                  <td className="p-2">{r.address}</td>
                  <td className="p-2">{r.installation_type}</td>
                  <td className="p-2">{r.system_type}</td>
                  <td className="p-2">{r.monthly_bill}</td>
                  <td className="p-2">{r.pincode}</td>
                  <td className="p-2">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-2">
                    <Button size="sm" onClick={() => openEdit(r)} className="mr-2">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && requirements.length === 0 && <div className="text-center py-4">No requirements found.</div>}
        
        <Dialog open={!!editing} onOpenChange={closeEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Requirement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input 
                value={editForm.customer_name || ''} 
                onChange={(e) => handleEditChange('customer_name', e.target.value)} 
                placeholder="Customer Name" 
              />
              <Input 
                value={editForm.customer_email || ''} 
                onChange={(e) => handleEditChange('customer_email', e.target.value)} 
                placeholder="Email" 
              />
              <Input 
                value={editForm.customer_phone || ''} 
                onChange={(e) => handleEditChange('customer_phone', e.target.value)} 
                placeholder="Phone" 
              />
              <Input 
                value={editForm.address || ''} 
                onChange={(e) => handleEditChange('address', e.target.value)} 
                placeholder="Address" 
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
                value={editForm.monthly_bill || ''} 
                onChange={(e) => handleEditChange('monthly_bill', parseFloat(e.target.value))} 
                placeholder="Monthly Bill" 
              />
              <Input 
                value={editForm.pincode || ''} 
                onChange={(e) => handleEditChange('pincode', e.target.value)} 
                placeholder="Pincode" 
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

export default RequirementsManagement;
