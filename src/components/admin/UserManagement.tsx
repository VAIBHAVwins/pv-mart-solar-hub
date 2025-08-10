
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'customer' | 'vendor';
  is_verified: boolean;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, phone, role, is_verified, created_at')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user and all related data?')) return;
    setLoading(true);
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  const openEdit = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({ ...user });
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: 'admin' | 'customer' | 'vendor') => {
    setEditForm({ ...editForm, role });
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    setEditLoading(true);
    
    try {
      const updateData: any = {
        email: editForm.email,
        full_name: editForm.full_name,
        phone: editForm.phone,
        role: editForm.role,
        is_verified: editForm.is_verified
      };

      await supabase.from('users').update(updateData).eq('id', editingUser.id);
    } catch (error) {
      console.error('Error updating user:', error);
    }
    
    setEditLoading(false);
    closeEdit();
    fetchUsers();
  };

  const handleDownloadCSV = () => {
    const csv = [
      ['Email', 'Full Name', 'Phone', 'Role', 'Verified', 'Created At'],
      ...users.map(u => [u.email, u.full_name || '', u.phone, u.role, u.is_verified ? 'Yes' : 'No', u.created_at])
    ].map(row => row.map(String).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} disabled={loading}>Refresh</Button>
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
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Verified</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.full_name}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2">{user.is_verified ? '✅' : '❌'}</td>
                  <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="p-2">
                    <Button size="sm" onClick={() => openEdit(user)} className="mr-2">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && users.length === 0 && <div className="text-center py-4">No users found.</div>}
      </CardContent>
      
      <Dialog open={!!editingUser} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              name="email" 
              value={editForm.email || ''} 
              onChange={handleEditChange} 
              placeholder="Email" 
            />
            <Input 
              name="full_name" 
              value={editForm.full_name || ''} 
              onChange={handleEditChange} 
              placeholder="Full Name" 
            />
            <Input 
              name="phone" 
              value={editForm.phone || ''} 
              onChange={handleEditChange} 
              placeholder="Phone" 
            />
            <Select value={editForm.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
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

export default UserManagement;
