
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Trash2, Edit, Plus, Save, X, Check, Eye } from 'lucide-react';

interface HeroImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HeroImageForm {
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  order_index: number;
  is_active: boolean;
}

const HeroImageManager = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useSupabaseAuth();

  const [formData, setFormData] = useState<HeroImageForm>({
    title: '',
    description: '',
    image_url: '',
    cta_text: 'Learn More',
    cta_link: '#',
    order_index: 0,
    is_active: true
  });

  // Fetch hero images using Supabase client
  const fetchHeroImages = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching hero images:', error);
        throw error;
      }
      
      setHeroImages(data || []);
    } catch (err: any) {
      console.error('Error fetching hero images:', err);
      setError('Failed to load hero images: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Add new hero image using Supabase client
  const addHeroImage = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase
        .from('hero_images')
        .insert([formData])
        .select();

      if (error) {
        console.error('Error adding hero image:', error);
        throw error;
      }

      setSuccess('Hero image added successfully!');
      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        cta_text: 'Learn More',
        cta_link: '#',
        order_index: 0,
        is_active: true
      });
      fetchHeroImages();
    } catch (err: any) {
      console.error('Error adding hero image:', err);
      setError('Failed to add hero image: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Update hero image using Supabase client
  const updateHeroImage = async (id: string, updates: Partial<HeroImageForm>) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase
        .from('hero_images')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating hero image:', error);
        throw error;
      }

      setSuccess('Hero image updated successfully!');
      setEditingId(null);
      fetchHeroImages();
    } catch (err: any) {
      console.error('Error updating hero image:', err);
      setError('Failed to update hero image: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Delete hero image using Supabase client
  const deleteHeroImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting hero image:', error);
        throw error;
      }

      setSuccess('Hero image deleted successfully!');
      fetchHeroImages();
    } catch (err: any) {
      console.error('Error deleting hero image:', err);
      setError('Failed to delete hero image: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Start editing an image
  const startEditing = (image: HeroImage) => {
    setEditingId(image.id);
    setFormData({
      title: image.title,
      description: image.description,
      image_url: image.image_url,
      cta_text: image.cta_text || 'Learn More',
      cta_link: image.cta_link || '#',
      order_index: image.order_index,
      is_active: image.is_active
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      cta_text: 'Learn More',
      cta_link: '#',
      order_index: 0,
      is_active: true
    });
  };

  // Save edited image
  const saveEdit = async () => {
    if (!editingId) return;
    await updateHeroImage(editingId, formData);
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleInputChange = (field: keyof HeroImageForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Temporary bypass for testing - comment out the user check
  // if (!user) {
  //   return (
  //     <Card>
  //       <CardContent className="p-6">
  //         <p className="text-center text-gray-600">Please log in to manage hero images.</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // Temporary debug info
  console.log('HeroImageManager - user:', user);
  console.log('HeroImageManager - bypassing user check for testing');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Images Management</CardTitle>
          <CardDescription>
            Manage homepage banner images and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Hero Images</h3>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Image
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Add New Hero Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Hero image title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Hero image description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Text</label>
                    <Input
                      value={formData.cta_text}
                      onChange={(e) => handleInputChange('cta_text', e.target.value)}
                      placeholder="Learn More"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Link</label>
                    <Input
                      value={formData.cta_link}
                      onChange={(e) => handleInputChange('cta_link', e.target.value)}
                      placeholder="/about"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Index</label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={addHeroImage} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Form */}
          {editingId && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Edit Hero Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Hero image title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Hero image description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Text</label>
                    <Input
                      value={formData.cta_text}
                      onChange={(e) => handleInputChange('cta_text', e.target.value)}
                      placeholder="Learn More"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Link</label>
                    <Input
                      value={formData.cta_link}
                      onChange={(e) => handleInputChange('cta_link', e.target.value)}
                      placeholder="/about"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Index</label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_is_active"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="edit_is_active" className="text-sm font-medium">Active</label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={saveEdit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={cancelEditing}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heroImages.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded overflow-hidden">
                        <img 
                          src={image.image_url} 
                          alt={image.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x48?text=No+Image';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{image.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{image.description}</TableCell>
                    <TableCell>{image.order_index}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        image.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {image.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(image)}
                          disabled={editingId === image.id}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteHeroImage(image.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {heroImages.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No hero images found. Add some to get started!
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroImageManager;
