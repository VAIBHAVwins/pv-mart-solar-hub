import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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

interface User {
  id: string;
  full_name?: string;
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
    const { data: usersData } = await supabase
      .from('users')
      .select('id, full_name');
    console.log('Fetched requirements:', requirementsData);
    console.log('Fetched users:', usersData);
    const userMap: Record<string, string> = {};
    (usersData || []).forEach((u: User) => {
      if (u.id) userMap[u.id] = u.full_name || '';
    });
    setRequirements((requirementsData || []).map((r: Requirement) => ({ ...r, customer_name: userMap[r.customer_id] || 'Unknown Customer' })));
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
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Installation Type</th>
              <th>System Type</th>
              <th>Monthly Bill</th>
              <th>Pincode</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map(r => (
              <tr key={r.id}>
                <td>{r.customer_name}</td>
                <td>{r.customer_email}</td>
                <td>{r.customer_phone}</td>
                <td>{r.address}</td>
                <td>{r.installation_type}</td>
                <td>{r.system_type}</td>
                <td>{r.monthly_bill}</td>
                <td>{r.pincode}</td>
                <td>{r.created_at}</td>
                <td>
                  <Button size="sm" onClick={() => openEdit(r)} className="mr-2">Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && requirements.length === 0 && <div className="text-center py-4">No requirements found.</div>}
        <Dialog open={!!editing} onOpenChange={closeEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Requirement</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input name="customer_name" value={editForm.customer_name || ''} onChange={handleEditChange} placeholder="Customer Name" />
              <Input name="customer_email" value={editForm.customer_email || ''} onChange={handleEditChange} placeholder="Email" />
              <Input name="customer_phone" value={editForm.customer_phone || ''} onChange={handleEditChange} placeholder="Phone" />
              <Input name="address" value={editForm.address || ''} onChange={handleEditChange} placeholder="Address" />
              <Input name="installation_type" value={editForm.installation_type || ''} onChange={handleEditChange} placeholder="Installation Type" />
              <Input name="system_type" value={editForm.system_type || ''} onChange={handleEditChange} placeholder="System Type" />
              <Input name="monthly_bill" value={editForm.monthly_bill || ''} onChange={handleEditChange} placeholder="Monthly Bill" />
              <Input name="pincode" value={editForm.pincode || ''} onChange={handleEditChange} placeholder="Pincode" />
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