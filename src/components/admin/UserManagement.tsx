
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Trash2, Edit, Plus, Save, X, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  company_name?: string;
  contact_person?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // Fetch users and their profiles
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users with all required fields
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name, phone, role, is_active, email_verified, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch vendor profiles for company info
      const { data: vendorProfiles, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('user_id, company_name, contact_person');

      if (vendorError) console.warn('Error fetching vendor profiles:', vendorError);

      // Combine users with vendor profile data
      const usersWithProfiles = usersData?.map(user => ({
        ...user,
        company_name: vendorProfiles?.find(vp => vp.user_id === user.id)?.company_name,
        contact_person: vendorProfiles?.find(vp => vp.user_id === user.id)?.contact_person
      })) || [];

      setUsers(usersWithProfiles);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  async function updateUserRole(userId: string, role: string) {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: role as UserRole })
        .eq('id', userId);

      if (error) throw error;

      setSuccess(`Role updated to ${role} successfully!`);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating role:', err);
      setError(err.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  }

  // Update user profile
  async function updateUser(userId: string, updates: Partial<UserProfile>) {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      setSuccess('User updated successfully!');
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  }

  // Temporary bypass for testing
  console.log('UserManagement - user:', user);
  console.log('UserManagement - bypassing user check for testing');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage system users, their profiles, and role assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {error}
            </div>
          )}

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell className="font-medium">
                      {editingUserId === userProfile.id ? (
                        <Input
                          defaultValue={userProfile.full_name || ''}
                          className="w-full"
                          onBlur={(e) => updateUser(userProfile.id, { full_name: e.target.value })}
                        />
                      ) : (
                        userProfile.full_name || 'N/A'
                      )}
                    </TableCell>
                    <TableCell>{userProfile.email}</TableCell>
                    <TableCell>{userProfile.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={userProfile.role === 'admin' ? 'destructive' : userProfile.role === 'vendor' ? 'secondary' : 'default'}>
                        {userProfile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={userProfile.is_active ? 'default' : 'outline'}>
                        {userProfile.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {userProfile.email_verified && (
                        <Badge variant="outline" className="ml-1 text-xs">
                          Verified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{userProfile.company_name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUserId(editingUserId === userProfile.id ? null : userProfile.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Select onValueChange={(role) => updateUserRole(userProfile.id, role)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Change Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="vendor">Vendor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No users found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
