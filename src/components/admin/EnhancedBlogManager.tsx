
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Bold,
  Italic,
  Link,
  Image as ImageIcon
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  category: string | null;
  tags: string[];
  author: string;
  status: string;
  is_pinned: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const EnhancedBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category: '',
    tags: '',
    author: 'PV Mart Team',
    status: 'draft' as 'draft' | 'published' | 'archived',
    is_pinned: false
  });

  const categories = [
    'Technology', 'Policy', 'Maintenance', 'Finance', 
    'Guide', 'News', 'Tips', 'Education', 'Installation'
  ];

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featured_image_url: '',
      category: '',
      tags: '',
      author: 'PV Mart Team',
      status: 'draft',
      is_pinned: false
    });
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
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
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, featured_image_url: publicUrl }));
      setSuccess('Image uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const insertFormatting = (format: string) => {
    const contentArea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (!contentArea) return;

    const start = contentArea.selectionStart;
    const end = contentArea.selectionEnd;
    const selectedText = contentArea.value.substring(start, end);
    
    let replacement = '';
    switch (format) {
      case 'bold':
        replacement = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText || 'italic text'}</em>`;
        break;
      case 'h2':
        replacement = `<h2>${selectedText || 'Heading'}</h2>`;
        break;
      case 'h3':
        replacement = `<h3>${selectedText || 'Subheading'}</h3>`;
        break;
      case 'p':
        replacement = `<p>${selectedText || 'Paragraph text'}</p>`;
        break;
      case 'link':
        replacement = `<a href="https://example.com" target="_blank">${selectedText || 'link text'}</a>`;
        break;
      case 'ul':
        replacement = `<ul><li>${selectedText || 'List item'}</li></ul>`;
        break;
      case 'ol':
        replacement = `<ol><li>${selectedText || 'Numbered item'}</li></ol>`;
        break;
    }

    const newContent = 
      contentArea.value.substring(0, start) + 
      replacement + 
      contentArea.value.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Focus back on textarea
    setTimeout(() => {
      contentArea.focus();
      contentArea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    setError('');
    
    try {
      const slug = generateSlug(formData.title);
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const blogData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        featured_image_url: formData.featured_image_url || null,
        category: formData.category || null,
        tags: tagsArray,
        author: formData.author,
        status: formData.status,
        is_pinned: formData.is_pinned,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);

        if (error) throw error;
        setSuccess('Blog post updated successfully!');
        setEditingBlog(null);
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);

        if (error) throw error;
        setSuccess('Blog post created successfully!');
        setShowAddDialog(false);
      }

      resetForm();
      fetchBlogs();
    } catch (err: any) {
      console.error('Error saving blog:', err);
      setError(err.message || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Blog post deleted successfully!');
      fetchBlogs();
    } catch (err: any) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog post');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      setSuccess(`Blog post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
      fetchBlogs();
    } catch (err: any) {
      console.error('Error toggling blog status:', err);
      setError('Failed to update blog status');
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ is_pinned: !currentPinned })
        .eq('id', id);

      if (error) throw error;
      setSuccess(`Blog post ${!currentPinned ? 'pinned' : 'unpinned'} successfully!`);
      fetchBlogs();
    } catch (err: any) {
      console.error('Error toggling blog pin:', err);
      setError('Failed to update blog pin status');
    }
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      featured_image_url: blog.featured_image_url || '',
      category: blog.category || '',
      tags: blog.tags.join(', '),
      author: blog.author,
      status: blog.status as 'draft' | 'published' | 'archived',
      is_pinned: blog.is_pinned
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
                    <FileText className="w-5 h-5 mr-2" />
                    Blog Management
                  </CardTitle>
                  <CardDescription>
                    Create and manage blog posts with rich text formatting
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Blog Post
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

              {/* Blogs Table */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading blog posts...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {blog.is_pinned && (
                              <Pin className="w-4 h-4 text-blue-600" />
                            )}
                            <div>
                              <div className="font-medium">{blog.title}</div>
                              <div className="text-sm text-gray-500">{blog.author}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {blog.category && (
                            <Badge variant="outline">{blog.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            blog.status === 'published' ? 'default' : 
                            blog.status === 'draft' ? 'secondary' : 'destructive'
                          }>
                            {blog.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {blog.published_at ? 
                            new Date(blog.published_at).toLocaleDateString() : 
                            '-'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTogglePin(blog.id, blog.is_pinned)}
                            >
                              {blog.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(blog.id, blog.status)}
                            >
                              {blog.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(blog)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(blog.id, blog.title)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {!loading && blogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No blog posts found. Create your first blog post to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Blog Dialog */}
        <Dialog open={showAddDialog || !!editingBlog} onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingBlog(null);
            resetForm();
            setError('');
            setSuccess('');
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
              <DialogDescription>
                Write and format your blog post with rich text editing capabilities.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the blog post"
                  rows={2}
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.featured_image_url ? (
                    <div className="relative">
                      <img
                        src={formData.featured_image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Upload featured image (Max 5MB)
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

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                
                {/* Formatting Toolbar */}
                <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('h2')}
                    title="Heading 2"
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('h3')}
                    title="Heading 3"
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('p')}
                    title="Paragraph"
                  >
                    P
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('bold')}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('italic')}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('link')}
                    title="Link"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('ul')}
                    title="Bullet List"
                  >
                    UL
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('ol')}
                    title="Numbered List"
                  >
                    OL
                  </Button>
                </div>
                
                <Textarea
                  id="blog-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here. Use the toolbar above to format your text."
                  rows={12}
                  className="border-t-0 rounded-t-none focus:ring-0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use HTML tags for advanced formatting. Select text and use toolbar buttons to format.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="solar, renewable, energy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_pinned"
                    checked={formData.is_pinned}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_pinned: e.target.checked }))}
                  />
                  <label htmlFor="is_pinned" className="text-sm font-medium">
                    Pin this post (display first)
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingBlog(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.title || !formData.content || uploading}
              >
                {editingBlog ? 'Update Post' : 'Create Post'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EnhancedBlogManager;
