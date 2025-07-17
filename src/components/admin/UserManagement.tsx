
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
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  role: UserRole;
  created_at: string;
  account_type?: UserRole;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users from the unified users table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Map users with account type
      const usersWithAccountType = usersData?.map(user => ({
        ...user,
        account_type: user.role as UserRole
      })) || [];

      setUsers(usersWithAccountType);
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

  // Temporary bypass for testing - comment out the user check
  // if (!user) {
  //   return (
  //     <Card>
  //       <CardContent className="p-6">
  //         <p className="text-center text-gray-600">Please log in to manage users.</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // Temporary debug info
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
                  <TableHead>Account Type</TableHead>
                  <TableHead>Phone</TableHead>
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
                          onBlur={(e) => updateUserProfile(userProfile.id, { full_name: e.target.value })}
                        />
                      ) : (
                        userProfile.full_name || 'N/A'
                      )}
                    </TableCell>
                    <TableCell>{userProfile.email}</TableCell>
                    <TableCell>
                      <Badge variant={userProfile.account_type === 'vendor' ? 'secondary' : userProfile.account_type === 'customer' ? 'default' : 'outline'}>
                        {userProfile.account_type || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>{userProfile.phone || 'N/A'}</TableCell>
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
                        <Select onValueChange={(role) => updateUserRole(userProfile.id, role as UserRole)}>
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

  // Update user role
  async function updateUserRole(userId: string, role: UserRole) {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
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
  async function updateUserProfile(userId: string, updates: Partial<Pick<UserProfile, 'full_name' | 'phone' | 'company_name'>>) {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      setSuccess('User profile updated successfully!');
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  }
};

export default UserManagement;
