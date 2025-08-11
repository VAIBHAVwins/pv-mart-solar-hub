
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Appliance {
  id: string;
  name: string;
  wattage: number;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ApplianceManager = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    wattage: '',
    type: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const applianceTypes = [
    'Lighting',
    'Fans',
    'Kitchen',
    'Major Appliances',
    'Entertainment',
    'Computing',
    'Others'
  ];

  const fetchAppliances = async () => {
    try {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setAppliances(data || []);
    } catch (error) {
      console.error('Error fetching appliances:', error);
      toast({
        title: "Error",
        description: "Failed to load appliances. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.wattage || !formData.type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const applianceData = {
        name: formData.name.trim(),
        wattage: parseInt(formData.wattage),
        type: formData.type,
        is_active: formData.is_active
      };

      let error;

      if (editingAppliance) {
        ({ error } = await supabase
          .from('appliances')
          .update(applianceData)
          .eq('id', editingAppliance.id));
      } else {
        ({ error } = await supabase
          .from('appliances')
          .insert([applianceData]));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Appliance ${editingAppliance ? 'updated' : 'added'} successfully!`
      });

      setFormData({ name: '', wattage: '', type: '', is_active: true });
      setShowAddDialog(false);
      setEditingAppliance(null);
      fetchAppliances();
    } catch (error) {
      console.error('Error saving appliance:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingAppliance ? 'update' : 'add'} appliance. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setFormData({
      name: appliance.name,
      wattage: appliance.wattage.toString(),
      type: appliance.type,
      is_active: appliance.is_active
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appliance?')) return;

    try {
      const { error } = await supabase
        .from('appliances')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appliance deleted successfully!"
      });

      fetchAppliances();
    } catch (error) {
      console.error('Error deleting appliance:', error);
      toast({
        title: "Error",
        description: "Failed to delete appliance. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('appliances')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Appliance ${!currentStatus ? 'activated' : 'deactivated'} successfully!`
      });

      fetchAppliances();
    } catch (error) {
      console.error('Error updating appliance status:', error);
      toast({
        title: "Error",
        description: "Failed to update appliance status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', wattage: '', type: '', is_active: true });
    setEditingAppliance(null);
    setShowAddDialog(false);
  };

  useEffect(() => {
    fetchAppliances();
  }, []);

  // Group appliances by type for better organization
  const groupedAppliances = appliances.reduce((groups, appliance) => {
    const type = appliance.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(appliance);
    return groups;
  }, {} as Record<string, Appliance[]>);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appliances...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            Appliance Load Control Panel
          </h1>
          <p className="text-gray-600 mt-1">
            Manage appliances and their power consumption data for the load calculator
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Appliance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAppliance ? 'Edit Appliance' : 'Add New Appliance'}
              </DialogTitle>
              <DialogDescription>
                {editingAppliance 
                  ? 'Update the appliance details below.'
                  : 'Enter the details for the new appliance.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Appliance Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., LED Light - 9W"
                  required
                />
              </div>
              <div>
                <Label htmlFor="wattage">Wattage (W) *</Label>
                <Input
                  id="wattage"
                  type="number"
                  min="1"
                  value={formData.wattage}
                  onChange={(e) => setFormData({ ...formData, wattage: e.target.value })}
                  placeholder="e.g., 9"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Category *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {applianceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active (visible in load calculator)</Label>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : (editingAppliance ? 'Update' : 'Add')} Appliance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{appliances.length}</div>
            <p className="text-xs text-muted-foreground">Total Appliances</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {appliances.filter(a => a.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {appliances.filter(a => !a.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(groupedAppliances).length}
            </div>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Appliances Table by Category */}
      <div className="space-y-6">
        {Object.entries(groupedAppliances).map(([type, typeAppliances]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-lg">{type}</CardTitle>
              <CardDescription>
                {typeAppliances.length} appliance(s) in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Wattage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeAppliances.map((appliance) => (
                    <TableRow key={appliance.id}>
                      <TableCell className="font-medium">{appliance.name}</TableCell>
                      <TableCell>{appliance.wattage}W</TableCell>
                      <TableCell>
                        <Badge variant={appliance.is_active ? "default" : "secondary"}>
                          {appliance.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(appliance.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatus(appliance.id, appliance.is_active)}
                          >
                            {appliance.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(appliance)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(appliance.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplianceManager;
