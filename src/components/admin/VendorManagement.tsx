
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
  created_at: string;
  vendor_profile?: {
    company_name: string;
    contact_person: string;
    license_number: string;
    address: string;
    is_verified: boolean;
  };
}

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select(`
        id, email, full_name, phone, created_at,
        vendor_profiles (
          company_name, contact_person, license_number, address, is_verified
        )
      `)
      .eq('role', 'vendor')
      .order('created_at', { ascending: true });
    
    if (!error) {
      const mappedVendors = (data || []).map(vendor => ({
        ...vendor,
        vendor_profile: vendor.vendor_profiles?.[0] || null
      }));
      setVendors(mappedVendors);
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
    setEditForm({ 
      email: vendor.email,
      full_name: vendor.full_name,
      phone: vendor.phone,
      company_name: vendor.vendor_profile?.company_name || '',
      contact_person: vendor.vendor_profile?.contact_person || '',
      license_number: vendor.vendor_profile?.license_number || '',
      address: vendor.vendor_profile?.address || '',
      is_verified: vendor.vendor_profile?.is_verified || false
    });
  };
  
  const closeEdit = () => {
    setEditingVendor(null);
    setEditForm({});
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ 
      ...editForm, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };
  
  const saveEdit = async () => {
    if (!editingVendor) return;
    setEditLoading(true);
    
    // Update users table
    await supabase.from('users').update({
      email: editForm.email,
      full_name: editForm.full_name,
      phone: editForm.phone,
    }).eq('id', editingVendor.id);
    
    // Update vendor_profiles table
    await supabase.from('vendor_profiles').update({
      company_name: editForm.company_name,
      contact_person: editForm.contact_person,
      license_number: editForm.license_number,
      address: editForm.address,
      is_verified: editForm.is_verified,
    }).eq('user_id', editingVendor.id);
    
    setEditLoading(false);
    closeEdit();
    fetchVendors();
  };

  const handleDownloadCSV = () => {
    const csv = [
      ['Email', 'Full Name', 'Phone', 'Company Name', 'Contact Person', 'License Number', 'Address', 'Verified'],
      ...vendors.map(v => [
        v.email, 
        v.full_name, 
        v.phone, 
        v.vendor_profile?.company_name || '',
        v.vendor_profile?.contact_person || '',
        v.vendor_profile?.license_number || '',
        v.vendor_profile?.address || '',
        v.vendor_profile?.is_verified ? 'Yes' : 'No'
      ])
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
              <tr>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Company</th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">License</th>
                <th className="text-left p-2">Verified</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => (
                <tr key={vendor.id} className="border-t">
                  <td className="p-2">{vendor.email}</td>
                  <td className="p-2">{vendor.vendor_profile?.company_name || 'N/A'}</td>
                  <td className="p-2">{vendor.vendor_profile?.contact_person || vendor.full_name}</td>
                  <td className="p-2">{vendor.phone}</td>
                  <td className="p-2">{vendor.vendor_profile?.license_number || 'N/A'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      vendor.vendor_profile?.is_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.vendor_profile?.is_verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-2">
                    <Button size="sm" onClick={() => openEdit(vendor)} className="mr-2">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(vendor.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && vendors.length === 0 && <div className="text-center py-4">No vendors found.</div>}
      </CardContent>
      <Dialog open={!!editingVendor} onOpenChange={closeEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input name="email" value={editForm.email || ''} onChange={handleEditChange} placeholder="Email" />
            <Input name="full_name" value={editForm.full_name || ''} onChange={handleEditChange} placeholder="Full Name" />
            <Input name="phone" value={editForm.phone || ''} onChange={handleEditChange} placeholder="Phone" />
            <Input name="company_name" value={editForm.company_name || ''} onChange={handleEditChange} placeholder="Company Name" />
            <Input name="contact_person" value={editForm.contact_person || ''} onChange={handleEditChange} placeholder="Contact Person" />
            <Input name="license_number" value={editForm.license_number || ''} onChange={handleEditChange} placeholder="License Number" />
            <Input name="address" value={editForm.address || ''} onChange={handleEditChange} placeholder="Address" />
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="is_verified" 
                checked={editForm.is_verified || false} 
                onChange={handleEditChange}
                className="rounded"
              />
              <label className="text-sm">Verified Vendor</label>
            </div>
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
