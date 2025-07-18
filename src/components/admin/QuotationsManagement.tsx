import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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
  company_name?: string;
}

interface User {
  id: string;
  company_name?: string;
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
    const { data: usersData } = await supabase
      .from('users')
      .select('id, company_name');
    console.log('Fetched quotations:', quotationsData);
    console.log('Fetched users:', usersData);
    const userMap: Record<string, string> = {};
    (usersData || []).forEach((u: User) => {
      if (u.id) userMap[u.id] = u.company_name || '';
    });
    setQuotations((quotationsData || []).map((q: Quotation) => ({ ...q, company_name: userMap[q.vendor_id] || 'Unknown Vendor' })));
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
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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
      ['Company Name', 'Vendor Name', 'Email', 'Phone', 'Installation Type', 'System Type', 'Total Price', 'Created At'],
      ...quotations.map(q => [q.company_name, q.vendor_name, q.vendor_email, q.vendor_phone, q.installation_type, q.system_type, q.total_price, q.created_at])
    ].map(row => row.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Vendor Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Installation Type</th>
              <th>System Type</th>
              <th>Total Price</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map(q => (
              <tr key={q.id}>
                <td>{q.company_name}</td>
                <td>{q.vendor_name}</td>
                <td>{q.vendor_email}</td>
                <td>{q.vendor_phone}</td>
                <td>{q.installation_type}</td>
                <td>{q.system_type}</td>
                <td>{q.total_price}</td>
                <td>{q.created_at}</td>
                <td>
                  <Button size="sm" onClick={() => openEdit(q)} className="mr-2">Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && quotations.length === 0 && <div className="text-center py-4">No quotations found.</div>}
        <Dialog open={!!editing} onOpenChange={closeEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Quotation</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input name="vendor_name" value={editForm.vendor_name || ''} onChange={handleEditChange} placeholder="Vendor Name" />
              <Input name="vendor_email" value={editForm.vendor_email || ''} onChange={handleEditChange} placeholder="Email" />
              <Input name="vendor_phone" value={editForm.vendor_phone || ''} onChange={handleEditChange} placeholder="Phone" />
              <Input name="installation_type" value={editForm.installation_type || ''} onChange={handleEditChange} placeholder="Installation Type" />
              <Input name="system_type" value={editForm.system_type || ''} onChange={handleEditChange} placeholder="System Type" />
              <Input name="total_price" value={editForm.total_price || ''} onChange={handleEditChange} placeholder="Total Price" />
              <Input name="installation_charge" value={editForm.installation_charge || ''} onChange={handleEditChange} placeholder="Installation Charge" />
              <Input name="warranty_years" value={editForm.warranty_years || ''} onChange={handleEditChange} placeholder="Warranty Years" />
              <Input name="description" value={editForm.description || ''} onChange={handleEditChange} placeholder="Description" />
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