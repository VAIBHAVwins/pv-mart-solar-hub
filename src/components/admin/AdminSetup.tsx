
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useSupabaseAuth();

  const createAdminUser = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // First, sign up the admin user with the specified credentials
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'ecogrid.ai@gmail.com',
        password: 'ECOGRID_AI-28/02/2025',
        options: {
          data: {
            full_name: 'EcoGrid Admin',
            user_type: 'admin'
          }
        }
      });

      if (authError) {
        // If user already exists, try to sign them in
        if (authError.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'ecogrid.ai@gmail.com',
            password: 'ECOGRID_AI-28/02/2025'
          });

          if (signInError) throw signInError;
          
          // Add admin role to existing user
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: signInData.user?.id,
              role: 'admin'
            });

          if (roleError && !roleError.message.includes('duplicate')) {
            throw roleError;
          }

          setMessage('Admin user already exists and admin role has been assigned!');
        } else {
          throw authError;
        }
      } else if (authData.user) {
        // Add admin role to the new user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'admin'
          });

        if (roleError) throw roleError;

        setMessage('Admin user created successfully! Please check email for verification.');
      }
    } catch (err: any) {
      console.error('Error creating admin user:', err);
      setError(err.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setError('No user is currently logged in');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        });

      if (error && !error.message.includes('duplicate')) {
        throw error;
      }

      setMessage('Admin role assigned to current user successfully!');
    } catch (err: any) {
      console.error('Error assigning admin role:', err);
      setError(err.message || 'Failed to assign admin role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            Create admin user or assign admin role to current user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Create Default Admin User</h4>
            <p className="text-sm text-gray-600 mb-4">
              Email: ecogrid.ai@gmail.com<br />
              Password: ECOGRID_AI-28/02/2025
            </p>
            <Button 
              onClick={createAdminUser} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Admin User'}
            </Button>
          </div>

          {user && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Make Current User Admin</h4>
              <p className="text-sm text-gray-600 mb-4">
                Current user: {user.email}
              </p>
              <Button 
                onClick={makeCurrentUserAdmin} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Assigning...' : 'Make Me Admin'}
              </Button>
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
