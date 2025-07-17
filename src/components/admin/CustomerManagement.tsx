
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: true });
    if (!error) setCustomers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this customer and all related data?')) return;
    setLoading(true);
    await supabase.from('users').delete().eq('id', id);
    fetchCustomers();
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({ ...customer });
  };
  
  const closeEdit = () => {
    setEditingCustomer(null);
    setEditForm({});
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  
  const saveEdit = async () => {
    if (!editingCustomer) return;
    setEditLoading(true);
    await supabase.from('users').update({
      email: editForm.email,
      full_name: editForm.full_name,
      phone: editForm.phone,
    }).eq('id', editingCustomer.id);
    setEditLoading(false);
    closeEdit();
    fetchCustomers();
  };

  const handleDownloadCSV = () => {
    const csv = [
      ['Email', 'Full Name', 'Phone'],
      ...customers.map(c => [c.email, c.full_name, c.phone])
    ].map(row => row.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={fetchCustomers} disabled={loading}>Refresh</Button>
          <Button onClick={handleDownloadCSV} disabled={loading}>Download CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.email}</td>
                <td>{customer.full_name}</td>
                <td>{customer.phone}</td>
                <td>
                  <Button size="sm" onClick={() => openEdit(customer)} className="mr-2">Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(customer.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && customers.length === 0 && <div className="text-center py-4">No customers found.</div>}
      </CardContent>
      <Dialog open={!!editingCustomer} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input name="email" value={editForm.email || ''} onChange={handleEditChange} placeholder="Email" />
            <Input name="full_name" value={editForm.full_name || ''} onChange={handleEditChange} placeholder="Full Name" />
            <Input name="phone" value={editForm.phone || ''} onChange={handleEditChange} placeholder="Phone" />
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

export default CustomerManagement;
