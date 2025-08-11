
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Image as ImageIcon, 
  Edit, 
  Trash2, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  GripVertical,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

interface HeroBanner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  order_index: number;
  display_duration: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const HeroBannerManager = () => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    cta_text: 'Learn More',
    cta_link: '#',
    display_duration: 6000,
    is_active: true
  });

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (err: any) {
      console.error('Error fetching banners:', err);
      setError('Failed to load hero banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      cta_text: 'Learn More',
      cta_link: '#',
      display_duration: 6000,
      is_active: true
    });
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero_images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setSuccess('Image uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.image_url) {
      setError('Title and image are required');
      return;
    }

    setError('');
    
    try {
      const bannerData = {
        ...formData,
        order_index: editingBanner ? editingBanner.order_index : banners.length + 1
      };

      if (editingBanner) {
        const { error } = await supabase
          .from('hero_images')
          .update(bannerData)
          .eq('id', editingBanner.id);

        if (error) throw error;
        setSuccess('Hero banner updated successfully!');
        setEditingBanner(null);
      } else {
        const { error } = await supabase
          .from('hero_images')
          .insert([bannerData]);

        if (error) throw error;
        setSuccess('Hero banner created successfully!');
        setShowAddDialog(false);
      }

      resetForm();
      fetchBanners();
    } catch (err: any) {
      console.error('Error saving banner:', err);
      setError(err.message || 'Failed to save hero banner');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Hero banner deleted successfully!');
      fetchBanners();
    } catch (err: any) {
      console.error('Error deleting banner:', err);
      setError('Failed to delete hero banner');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setSuccess(`Hero banner ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchBanners();
    } catch (err: any) {
      console.error('Error toggling banner status:', err);
      setError('Failed to update banner status');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }

    const newBanners = [...banners];
    const draggedBanner = newBanners[draggedItem];
    
    // Remove dragged item
    newBanners.splice(draggedItem, 1);
    // Insert at new position
    newBanners.splice(dropIndex, 0, draggedBanner);

    // Update order_index for all banners
    const updates = newBanners.map((banner, index) => ({
      id: banner.id,
      order_index: index + 1
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('hero_images')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }

      setSuccess('Banner order updated successfully!');
      fetchBanners();
    } catch (err: any) {
      console.error('Error updating banner order:', err);
      setError('Failed to update banner order');
    }

    setDraggedItem(null);
  };

  const openEditDialog = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url,
      cta_text: banner.cta_text || 'Learn More',
      cta_link: banner.cta_link || '#',
      display_duration: banner.display_duration,
      is_active: banner.is_active
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Hero Banner Management
                  </CardTitle>
                  <CardDescription>
                    Manage homepage hero banners with drag-and-drop ordering
                    <br />
                    <span className="text-blue-600 font-medium">
                      Recommended size: 1200x600px (2:1 ratio) | Max file size: 10MB
                    </span>
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hero Banner
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Messages */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Banners List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading hero banners...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-move"
                    >
                      <div className="flex items-center space-x-4">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        
                        <div className="w-24 h-12 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{banner.title}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {banner.description || 'No description'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={banner.is_active ? "default" : "secondary"}>
                              {banner.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {banner.display_duration / 1000}s
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(banner.id, banner.is_active)}
                          >
                            {banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(banner)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(banner.id, banner.title)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {banners.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hero banners found. Create your first banner to get started.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Banner Dialog */}
        <Dialog open={showAddDialog || !!editingBanner} onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingBanner(null);
            resetForm();
            setError('');
            setSuccess('');
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Edit Hero Banner' : 'Add New Hero Banner'}
              </DialogTitle>
              <DialogDescription>
                Create compelling hero banners for your homepage. Images should be 1200x600px for best results.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Banner Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.image_url ? (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Upload banner image (Max 10MB, 1200x600px recommended)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="mt-2"
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="mt-2 text-blue-600">Uploading...</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter banner title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Display Duration (ms)</label>
                  <Input
                    type="number"
                    value={formData.display_duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_duration: parseInt(e.target.value) || 6000 }))}
                    min="3000"
                    max="15000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter banner description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <Input
                    value={formData.cta_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                    placeholder="Learn More"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <Input
                    value={formData.cta_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_link: e.target.value }))}
                    placeholder="#"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Active (display on homepage)
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingBanner(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.title || !formData.image_url || uploading}
              >
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HeroBannerManager;
