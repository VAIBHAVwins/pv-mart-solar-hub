import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Eye, Edit, Trash2, Pin, PinOff } from 'lucide-react';
import { useBlogManager } from '@/hooks/useBlogManager';
import { BlogForm } from './BlogForm';
import { BlogTable } from './BlogTable';
import { BlogStats } from './BlogStats';

const BlogManager = () => {
  const {
    blogs,
    loading,
    error,
    success,
    editingId,
    showAddForm,
    stats,
    setShowAddForm,
    deleteBlog,
    startEditing,
    togglePin,
    resetForm
  } = useBlogManager();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <BlogStats stats={stats} />

      {/* Main Blog Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
          <CardDescription>
            Manage blog posts, create new content, and control publishing status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Blog Posts ({blogs.length})</h3>
            <Button 
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showAddForm) resetForm();
              }}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Blog
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && !editingId && (
            <BlogForm
              isEdit={false}
              onCancel={() => {
                setShowAddForm(false);
                resetForm();
              }}
            />
          )}

          {/* Edit Form */}
          {editingId && !showAddForm && (
            <BlogForm
              isEdit={true}
              onCancel={() => {
                // cancelEditing will be handled by BlogForm
              }}
            />
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
          <BlogTable
            blogs={blogs}
            onEdit={startEditing}
            onDelete={deleteBlog}
            onTogglePin={togglePin}
            loading={loading}
            editingId={editingId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager; 