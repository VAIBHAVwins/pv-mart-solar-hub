
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Trash2, Edit, Plus, Save, X, Check, Eye, Upload, Image as ImageIcon } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Upload file to Supabase Storage with better error handling
  const uploadFile = async (file: File): Promise<string> => {
    console.log('Starting file upload:', file.name, file.size, file.type);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `hero-images/${fileName}`;

    console.log('Uploading to path:', filePath);

    const { error: uploadError, data } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    console.log('Public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  };

  // Handle file upload with improved feedback
  const handleFileUpload = async (file: File) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    console.log('Processing file:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const imageUrl = await uploadFile(file);
      console.log('Upload completed, URL:', imageUrl);
      
      setUploadedImageUrl(imageUrl);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setSuccess('Image uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

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
    if (!formData.image_url) {
      setError('Please upload an image first');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Adding hero image with data:', formData);
      
      const { data, error } = await supabase
        .from('hero_images')
        .insert([formData])
        .select();

      if (error) {
        console.error('Error adding hero image:', error);
        throw error;
      }

      console.log('Hero image added successfully:', data);
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
      setUploadedImageUrl('');
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
      console.log('Updating hero image:', id, updates);
      
      const { data, error } = await supabase
        .from('hero_images')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating hero image:', error);
        throw error;
      }

      console.log('Hero image updated successfully:', data);
      setSuccess('Hero image updated successfully!');
      setEditingId(null);
      setUploadedImageUrl('');
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
      console.log('Deleting hero image:', id);
      
      // First, get the image to find the file path
      const { data: imageData } = await supabase
        .from('hero_images')
        .select('image_url')
        .eq('id', id)
        .single();

      // Delete from database
      const { error: dbError } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Error deleting hero image:', dbError);
        throw dbError;
      }

      // Try to delete from storage if it's a local file
      if (imageData?.image_url && imageData.image_url.includes('supabase.co')) {
        try {
          const urlParts = imageData.image_url.split('/');
          const filePath = urlParts[urlParts.length - 1];
          if (filePath) {
            await supabase.storage
              .from('hero-images')
              .remove([filePath]);
            console.log('File deleted from storage:', filePath);
          }
        } catch (storageError) {
          console.warn('Could not delete file from storage:', storageError);
        }
      }

      console.log('Hero image deleted successfully');
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
    setUploadedImageUrl(image.image_url);
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
    setUploadedImageUrl('');
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

  // File upload component with improved preview
  const FileUploadArea = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {isEdit ? 'Upload new image to replace current one' : 'Upload hero image'}
          </p>
          <p className="text-xs text-gray-500">
            Drag and drop an image here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              browse files
            </button>
          </p>
          <p className="text-xs text-gray-400">
            Supports: JPEG, PNG, WebP, GIF (max 5MB)
          </p>
        </div>

        {/* Show uploaded image preview */}
        {(uploadedImageUrl || formData.image_url) && (
          <div className="mt-4">
            <p className="text-sm font-medium text-green-600 mb-2">✓ Image uploaded</p>
            <div className="relative inline-block">
              <img 
                src={uploadedImageUrl || formData.image_url} 
                alt="Preview" 
                className="mx-auto max-h-32 rounded border"
                onError={(e) => {
                  console.error('Image preview error:', e);
                  e.currentTarget.src = 'https://via.placeholder.com/200x100?text=Image+Preview';
                }}
                onLoad={() => console.log('Image preview loaded successfully')}
              />
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl">
                ✓
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {uploadedImageUrl || formData.image_url}
            </p>
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Images Management</CardTitle>
          <CardDescription>
            Manage homepage banner images and content. Upload local images or use external URLs.
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
                {/* File Upload */}
                <FileUploadArea />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Hero image title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL (or upload above)</label>
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
                  <Button onClick={addHeroImage} disabled={loading || uploading || !formData.image_url}>
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
                {/* File Upload for Edit */}
                <FileUploadArea isEdit={true} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Hero image title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL (or upload above)</label>
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
                  <Button onClick={saveEdit} disabled={loading || uploading} className="bg-blue-600 hover:bg-blue-700">
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
