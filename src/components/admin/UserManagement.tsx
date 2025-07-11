
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

type UserRole = Database['public']['Enums']['app_role'];

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  user_type: string | null;
  phone: string | null;
  company_name: string | null;
  created_at: string;
  email?: string;
  roles?: UserRole[];
}

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<UserRoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // Fetch users and their roles
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(role => role.user_id === profile.user_id).map(role => role.role) || []
      })) || [];

      setUsers(usersWithRoles);
      setRoles(userRoles || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Assign role to user
  const assignRole = async (userId: string, role: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role as UserRole
        });

      if (error && !error.message.includes('duplicate')) {
        throw error;
      }

      setSuccess(`Role ${role} assigned successfully!`);
      fetchUsers();
    } catch (err: any) {
      console.error('Error assigning role:', err);
      setError(err.message || 'Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  // Remove role from user
  const removeRole = async (userId: string, role: UserRole) => {
    if (!confirm(`Are you sure you want to remove the ${role} role from this user?`)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      setSuccess(`Role ${role} removed successfully!`);
      fetchUsers();
    } catch (err: any) {
      console.error('Error removing role:', err);
      setError(err.message || 'Failed to remove role');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Please log in to manage users.</p>
        </CardContent>
      </Card>
    );
  }

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
                  <TableHead>Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell className="font-medium">
                      {editingUserId === userProfile.user_id ? (
                        <Input
                          defaultValue={userProfile.full_name || ''}
                          className="w-full"
                          onBlur={(e) => updateUserProfile(userProfile.user_id, { full_name: e.target.value })}
                        />
                      ) : (
                        userProfile.full_name || 'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={userProfile.user_type === 'admin' ? 'destructive' : 'secondary'}>
                        {userProfile.user_type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{userProfile.phone || 'N/A'}</TableCell>
                    <TableCell>{userProfile.company_name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userProfile.roles?.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                            <button
                              onClick={() => removeRole(userProfile.user_id, role)}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUserId(editingUserId === userProfile.user_id ? null : userProfile.user_id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Select onValueChange={(role) => assignRole(userProfile.user_id, role)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Add Role" />
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
