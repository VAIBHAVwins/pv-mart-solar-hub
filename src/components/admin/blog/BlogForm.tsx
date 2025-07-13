import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Save, X, Check, Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useBlogManager } from '@/hooks/useBlogManager';
import { BlogImageUpload } from './BlogImageUpload';

interface BlogFormProps {
  isEdit: boolean;
  onCancel: () => void;
}

export const BlogForm = ({ isEdit, onCancel }: BlogFormProps) => {
  const {
    formData,
    loading,
    uploading,
    dragActive,
    uploadedImageUrl,
    handleInputChange,
    handleTitleChange,
    handleTagsChange,
    handleFileUpload,
    handleDrag,
    handleDrop,
    addBlog,
    saveEdit,
    cancelEditing
  } = useBlogManager();

  const [content, setContent] = useState(formData.content);

  // Update content when formData changes (for editing)
  useEffect(() => {
    setContent(formData.content);
  }, [formData.content]);

  // Update formData when content changes
  useEffect(() => {
    handleInputChange('content', content);
  }, [content]);

  const canSubmit = !loading && !uploading && formData.title.trim() && content.trim();

  const handleSubmit = () => {
    if (isEdit) {
      saveEdit();
    } else {
      addBlog();
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      cancelEditing();
    } else {
      onCancel();
    }
  };

  return (
    <Card className={`mb-6 ${isEdit ? 'border-blue-200 bg-blue-50' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-lg ${isEdit ? 'text-blue-800' : ''}`}>
          {isEdit ? 'Edit Blog Post' : 'Add New Blog Post'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="auto-generated from title"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            placeholder="Brief description of the blog post"
            rows={3}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label>Featured Image</Label>
          <BlogImageUpload
            onFileUpload={handleFileUpload}
            uploading={uploading}
            dragActive={dragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            uploadedImageUrl={uploadedImageUrl}
            currentImageUrl={formData.featured_image_url}
            isEdit={isEdit}
          />
        </div>

        {/* Category and Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Guide">Guide</SelectItem>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Tips">Tips</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Author name"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags.join(', ')}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="efficiency, solar panels, technology"
            onKeyDown={(e) => {
              // Allow comma entry and editing
              if (e.key === ',') {
                e.stopPropagation();
              }
            }}
          />
        </div>

        {/* Pin */}
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="is_pinned"
            checked={formData.is_pinned}
            onChange={(e) => handleInputChange('is_pinned', e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="is_pinned">Pin this blog (display first)</Label>
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content">Content *</Label>
          <div className="border rounded-lg">
            <div className="border-b p-2 bg-gray-50">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setContent(prev => prev + '<h2>Heading</h2>')}
                >
                  H2
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setContent(prev => prev + '<p>Paragraph</p>')}
                >
                  P
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setContent(prev => prev + '<ul><li>List item</li></ul>')}
                >
                  List
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setContent(prev => prev + '<strong>Bold</strong>')}
                >
                  B
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setContent(prev => prev + '<em>Italic</em>')}
                >
                  I
                </Button>
              </div>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here. You can use HTML tags for formatting."
              rows={15}
              className="border-0 focus:ring-0"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt; for formatting.
          </p>
        </div>

        {/* Validation feedback */}
        {!formData.title.trim() && (
          <div className="text-sm text-red-600">
            ⚠️ Please enter a title
          </div>
        )}
        {!content.trim() && (
          <div className="text-sm text-red-600">
            ⚠️ Please enter content
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            className={isEdit ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {isEdit ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Save Changes' : 'Save Blog'}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 