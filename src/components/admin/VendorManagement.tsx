
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Vendor {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  is_verified: boolean;
  created_at: string;
  vendor_profiles?: {
    company_name: string;
    contact_person: string;
    license_number: string;
    address: string;
  }[];
}

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          email, 
          full_name, 
          phone, 
          role, 
          is_verified, 
          created_at,
          vendor_profiles (
            company_name,
            contact_person,
            license_number,
            address
          )
        `)
        .eq('role', 'vendor')
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setVendors(data as Vendor[]);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
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
    const profile = vendor.vendor_profiles?.[0];
    setEditForm({
      email: vendor.email,
      full_name: vendor.full_name,
      phone: vendor.phone,
      company_name: profile?.company_name || '',
      contact_person: profile?.contact_person || '',
      license_number: profile?.license_number || '',
      address: profile?.address || ''
    });
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
    
    try {
      // Update user info
      await supabase.from('users').update({
        email: editForm.email,
        full_name: editForm.full_name,
        phone: editForm.phone,
      }).eq('id', editingVendor.id);

      // Update or insert vendor profile
      const { data: existingProfile } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', editingVendor.id)
        .maybeSingle();

      if (existingProfile) {
        await supabase.from('vendor_profiles').update({
          company_name: editForm.company_name,
          contact_person: editForm.contact_person,
          license_number: editForm.license_number,
          address: editForm.address,
        }).eq('user_id', editingVendor.id);
      } else {
        await supabase.from('vendor_profiles').insert({
          user_id: editingVendor.id,
          company_name: editForm.company_name,
          contact_person: editForm.contact_person,
          license_number: editForm.license_number,
          address: editForm.address,
        });
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
    }
    
    setEditLoading(false);
    closeEdit();
    fetchVendors();
  };

  const handleDownloadCSV = () => {
    const csv = [
      ['Email', 'Full Name', 'Phone', 'Company Name', 'Contact Person', 'License Number', 'Address'],
      ...vendors.map(v => {
        const profile = v.vendor_profiles?.[0];
        return [
          v.email, 
          v.full_name || '', 
          v.phone, 
          profile?.company_name || '', 
          profile?.contact_person || '', 
          profile?.license_number || '', 
          profile?.address || ''
        ];
      })
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
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Full Name</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Company</th>
                <th className="text-left p-2">Contact Person</th>
                <th className="text-left p-2">License</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => {
                const profile = vendor.vendor_profiles?.[0];
                return (
                  <tr key={vendor.id} className="border-b">
                    <td className="p-2">{vendor.email}</td>
                    <td className="p-2">{vendor.full_name}</td>
                    <td className="p-2">{vendor.phone}</td>
                    <td className="p-2">{profile?.company_name || 'N/A'}</td>
                    <td className="p-2">{profile?.contact_person || 'N/A'}</td>
                    <td className="p-2">{profile?.license_number || 'N/A'}</td>
                    <td className="p-2">
                      <Button size="sm" onClick={() => openEdit(vendor)} className="mr-2">Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(vendor.id)}>Delete</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && vendors.length === 0 && <div className="text-center py-4">No vendors found.</div>}
      </CardContent>
      
      <Dialog open={!!editingVendor} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input name="email" value={editForm.email || ''} onChange={handleEditChange} placeholder="Email" />
            <Input name="full_name" value={editForm.full_name || ''} onChange={handleEditChange} placeholder="Full Name" />
            <Input name="phone" value={editForm.phone || ''} onChange={handleEditChange} placeholder="Phone" />
            <Input name="company_name" value={editForm.company_name || ''} onChange={handleEditChange} placeholder="Company Name" />
            <Input name="contact_person" value={editForm.contact_person || ''} onChange={handleEditChange} placeholder="Contact Person" />
            <Input name="license_number" value={editForm.license_number || ''} onChange={handleEditChange} placeholder="License Number" />
            <Input name="address" value={editForm.address || ''} onChange={handleEditChange} placeholder="Address" />
          </div>
          <DialogFooter>
            <Button onClick={saveEdit} disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={closeEdit}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VendorManagement;
