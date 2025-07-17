import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Vendor {
  id: string;
  email: string;
  company_name: string;
  contact_person: string;
  phone: string;
  license_number: string;
  address: string;
  created_at: string;
}

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<Partial<Vendor>>({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, company_name, contact_person, phone, license_number, address, created_at')
      .eq('role', 'vendor')
      .order('created_at', { ascending: true });
    if (!error) setVendors(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this vendor and all related data?')) return;
    setLoading(true);
    await supabase.from('users').delete().eq('id', id);
    fetchVendors();
  };

  const openEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditForm({ ...vendor });
  };
  const closeEdit = () => {
    setEditingVendor(null);
    setEditForm({});
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const saveEdit = async () => {
    if (!editingVendor) return;
    setEditLoading(true);
    await supabase.from('users').update({
      email: editForm.email,
      company_name: editForm.company_name,
      contact_person: editForm.contact_person,
      phone: editForm.phone,
      license_number: editForm.license_number,
      address: editForm.address,
    }).eq('id', editingVendor.id);
    setEditLoading(false);
    closeEdit();
    fetchVendors();
  };

  const handleDownloadCSV = () => {
    const csv = [
      ['Email', 'Company Name', 'Contact Person', 'Phone', 'License Number', 'Address'],
      ...vendors.map(v => [v.email, v.company_name, v.contact_person, v.phone, v.license_number, v.address])
    ].map(row => row.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendors.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vendor Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={fetchVendors} disabled={loading}>Refresh</Button>
          <Button onClick={handleDownloadCSV} disabled={loading}>Download CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Email</th>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>License Number</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id}>
                <td>{vendor.email}</td>
                <td>{vendor.company_name}</td>
                <td>{vendor.contact_person}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.license_number}</td>
                <td>{vendor.address}</td>
                <td>
                  <Button size="sm" onClick={() => openEdit(vendor)} className="mr-2">Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(vendor.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && vendors.length === 0 && <div className="text-center py-4">No vendors found.</div>}
      </CardContent>
      <Dialog open={!!editingVendor} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input name="email" value={editForm.email || ''} onChange={handleEditChange} placeholder="Email" />
            <Input name="company_name" value={editForm.company_name || ''} onChange={handleEditChange} placeholder="Company Name" />
            <Input name="contact_person" value={editForm.contact_person || ''} onChange={handleEditChange} placeholder="Contact Person" />
            <Input name="phone" value={editForm.phone || ''} onChange={handleEditChange} placeholder="Phone" />
            <Input name="license_number" value={editForm.license_number || ''} onChange={handleEditChange} placeholder="License Number" />
            <Input name="address" value={editForm.address || ''} onChange={handleEditChange} placeholder="Address" />
          </div>
          <DialogFooter>
            <Button onClick={saveEdit} disabled={editLoading}>Save</Button>
            <Button variant="secondary" onClick={closeEdit}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VendorManagement; 