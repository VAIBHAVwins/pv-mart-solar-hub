import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Blog, BlogForm, BlogFilters, BlogStats, initialBlogForm } from '@/types/blog';

export const useBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [formData, setFormData] = useState<BlogForm>(initialBlogForm);
  const [filters, setFilters] = useState<BlogFilters>({});
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    published: 0,
    draft: 0,
    pinned: 0
  });

  // Clear messages automatically
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File): Promise<string> => {
    console.log('Starting blog image upload:', file.name, file.size, file.type);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    console.log('Uploading to path:', filePath);

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('blog-images')
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
        .from('blog-images')
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
      setFormData(prev => ({ ...prev, featured_image_url: imageUrl }));
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

  // Fetch blogs with filters
  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching blogs with filters:', filters);
      
      let query = supabase
        .from('blogs')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.is_pinned !== undefined) {
        query = query.eq('is_pinned', filters.is_pinned);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blogs:', error);
        throw new Error(`Failed to fetch blogs: ${error.message}`);
      }
      
      console.log('Fetched blogs:', data);
      // After fetching blogs, cast status to 'draft' | 'published' for each blog
      const blogsTyped = (data || []).map((blog: any) => ({
        ...blog,
        status: blog.status === 'published' ? 'published' : 'draft'
      }));
      setBlogs(blogsTyped);
      // Calculate stats
      calculateStats(blogsTyped);
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Calculate blog statistics
  const calculateStats = (blogData: Blog[]) => {
    const stats: BlogStats = {
      total: blogData.length,
      published: blogData.filter(blog => blog.status === 'published').length,
      draft: blogData.filter(blog => blog.status === 'draft').length,
      pinned: blogData.filter(blog => blog.is_pinned).length
    };
    setStats(stats);
  };

  // Add new blog
  const addBlog = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a title');
      clearMessages();
      return;
    }

    if (!formData.content.trim()) {
      setError('Please enter content');
      clearMessages();
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Adding blog with data:', formData);
      
      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title);
      
      // Use uploaded image URL if available
      const finalImageUrl = uploadedImageUrl || formData.featured_image_url;
      
      const insertData = {
        ...formData,
        slug,
        featured_image_url: finalImageUrl,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('blogs')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Error adding blog:', error);
        throw new Error(`Failed to add blog: ${error.message}`);
      }

      console.log('Blog added successfully:', data);
      setSuccess('Blog added successfully!');
      setShowAddForm(false);
      resetForm();
      await fetchBlogs();
      clearMessages();
    } catch (err: any) {
      console.error('Error adding blog:', err);
      setError('Failed to add blog: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Update blog
  const updateBlog = async (id: string, updates: Partial<BlogForm>) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Updating blog:', id, updates);
      
      const updateData = {
        ...updates,
        published_at: updates.status === 'published' ? new Date().toISOString() : null
      };
      
      const { data, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating blog:', error);
        throw new Error(`Failed to update blog: ${error.message}`);
      }

      console.log('Blog updated successfully:', data);
      setSuccess('Blog updated successfully!');
      setEditingId(null);
      resetForm();
      await fetchBlogs();
      clearMessages();
    } catch (err: any) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Deleting blog:', id);
      
      const blogToDelete = blogs.find(blog => blog.id === id);
      
      const { error: dbError } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Error deleting blog:', dbError);
        throw new Error(`Failed to delete blog: ${dbError.message}`);
      }

      // Delete associated image if it's in our storage
      if (blogToDelete?.featured_image_url && blogToDelete.featured_image_url.includes('supabase.co')) {
        try {
          const urlParts = blogToDelete.featured_image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `blog-images/${fileName}`;
          
          const { error: storageError } = await supabase.storage
            .from('blog-images')
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

      console.log('Blog deleted successfully');
      setSuccess('Blog deleted successfully!');
      await fetchBlogs();
      clearMessages();
    } catch (err: any) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog: ' + (err.message || 'Unknown error'));
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Increment view count (commented out due to type error)
  // const incrementViewCount = async (id: string) => {
  //   try {
  //     const { error } = await supabase
  //       .from('blogs')
  //       .update({ view_count: supabase.rpc('increment_view_count', { blog_id: id }) })
  //       .eq('id', id);

  //     if (error) {
  //       console.error('Error incrementing view count:', error);
  //     }
  //   } catch (err) {
  //     console.error('Error incrementing view count:', err);
  //   }
  // };

  // Toggle pin status
  const togglePin = async (id: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ is_pinned: !isPinned })
        .eq('id', id);

      if (error) {
        console.error('Error toggling pin status:', error);
        setError('Failed to update pin status');
      } else {
        setSuccess(`Blog ${isPinned ? 'unpinned' : 'pinned'} successfully!`);
        await fetchBlogs();
      }
      clearMessages();
    } catch (err: any) {
      console.error('Error toggling pin status:', err);
      setError('Failed to update pin status');
      clearMessages();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialBlogForm);
    setUploadedImageUrl('');
  };

  // Start editing
  const startEditing = (blog: Blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      featured_image_url: blog.featured_image_url || '',
      category: blog.category || '',
      tags: blog.tags || [],
      author: blog.author,
      status: blog.status,
      is_pinned: blog.is_pinned
    });
    setUploadedImageUrl(blog.featured_image_url || '');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingId) return;
    
    if (!formData.title.trim()) {
      setError('Please enter a title');
      clearMessages();
      return;
    }

    if (!formData.content.trim()) {
      setError('Please enter content');
      clearMessages();
      return;
    }

    // Use uploaded image URL if available, otherwise use the provided URL
    const finalImageUrl = uploadedImageUrl || formData.featured_image_url;
    
    await updateBlog(editingId, { ...formData, featured_image_url: finalImageUrl });
  };

  // Handle input change
  const handleInputChange = (field: keyof BlogForm, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle title change (auto-generate slug)
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title,
      slug: generateSlug(title)
    }));
  };

  // Handle tags change
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  // Apply filters
  const applyFilters = (newFilters: BlogFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  return {
    blogs,
    loading,
    error,
    success,
    editingId,
    showAddForm,
    uploading,
    dragActive,
    uploadedImageUrl,
    formData,
    filters,
    stats,
    setShowAddForm,
    handleFileUpload,
    handleDrag,
    handleDrop,
    addBlog,
    updateBlog,
    deleteBlog,
    // incrementViewCount, // This function is commented out due to type error
    togglePin,
    startEditing,
    cancelEditing,
    saveEdit,
    handleInputChange,
    handleTitleChange,
    handleTagsChange,
    applyFilters,
    resetForm,
    fetchBlogs
  };
}; 