
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HeroImage, HeroImageForm, initialFormData } from './types';

export const useHeroImageManager = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [formData, setFormData] = useState<HeroImageForm>(initialFormData);

  // Clear messages automatically
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File): Promise<string> => {
    console.log('Starting file upload:', file.name, file.size, file.type);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `hero-images/${fileName}`;

    console.log('Uploading to path:', filePath);

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err: any) {
      console.error('File upload error:', err);
      throw new Error(err.message || 'Failed to upload file');
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) {
      setError('No file selected');
      clearMessages();
      return;
    }

    console.log('Processing file:', file.name, file.type, file.size);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      clearMessages();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      clearMessages();
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
      clearMessages();
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError('Failed to upload image: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
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

  // Fetch hero images
  const fetchHeroImages = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching hero images...');
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching hero images:', error);
        throw new Error(`Failed to fetch hero images: ${error.message}`);
      }
      
      console.log('Fetched hero images:', data);
      setHeroImages(data || []);
    } catch (err: any) {
      console.error('Error fetching hero images:', err);
      setError('Failed to load hero images: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Add new hero image
  const addHeroImage = async () => {
    if (!formData.image_url) {
      setError('Please upload an image first');
      clearMessages();
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      clearMessages();
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Adding hero image with data:', formData);
      
      const insertData = {
        ...formData,
        order_index: formData.order_index || heroImages.length
      };

      const { data, error } = await supabase
        .from('hero_images')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Error adding hero image:', error);
        throw new Error(`Failed to add hero image: ${error.message}`);
      }

      console.log('Hero image added successfully:', data);
      setSuccess('Hero image added successfully!');
      setShowAddForm(false);
      resetForm();
      await fetchHeroImages();
      clearMessages();
    } catch (err: any) {
      console.error('Error adding hero image:', err);
      setError('Failed to add hero image: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Update hero image
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
        throw new Error(`Failed to update hero image: ${error.message}`);
      }

      console.log('Hero image updated successfully:', data);
      setSuccess('Hero image updated successfully!');
      setEditingId(null);
      resetForm();
      await fetchHeroImages();
      clearMessages();
    } catch (err: any) {
      console.error('Error updating hero image:', err);
      setError('Failed to update hero image: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Delete hero image
  const deleteHeroImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Deleting hero image:', id);
      
      const imageToDelete = heroImages.find(img => img.id === id);
      
      const { error: dbError } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Error deleting hero image:', dbError);
        throw new Error(`Failed to delete hero image: ${dbError.message}`);
      }

      if (imageToDelete?.image_url && imageToDelete.image_url.includes('supabase.co')) {
        try {
          const urlParts = imageToDelete.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `hero-images/${fileName}`;
          
          const { error: storageError } = await supabase.storage
            .from('hero-images')
            .remove([filePath]);
            
          if (storageError) {
            console.warn('Could not delete file from storage:', storageError);
          } else {
            console.log('File deleted from storage:', filePath);
          }
        } catch (storageError) {
          console.warn('Could not delete file from storage:', storageError);
        }
      }

      console.log('Hero image deleted successfully');
      setSuccess('Hero image deleted successfully!');
      await fetchHeroImages();
      clearMessages();
    } catch (err: any) {
      console.error('Error deleting hero image:', err);
      setError('Failed to delete hero image: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedImageUrl('');
  };

  // Start editing
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
    resetForm();
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingId) return;
    await updateHeroImage(editingId, formData);
  };

  // Handle input change
  const handleInputChange = (field: keyof HeroImageForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  return {
    heroImages,
    loading,
    error,
    success,
    editingId,
    showAddForm,
    uploading,
    dragActive,
    uploadedImageUrl,
    formData,
    setShowAddForm,
    handleFileUpload,
    handleDrag,
    handleDrop,
    addHeroImage,
    updateHeroImage,
    deleteHeroImage,
    startEditing,
    cancelEditing,
    saveEdit,
    handleInputChange,
    resetForm
  };
};
