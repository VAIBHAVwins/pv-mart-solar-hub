import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Pin, PinOff, Eye } from 'lucide-react';
import { Blog } from '@/types/blog';

interface BlogTableProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  loading: boolean;
  editingId: string | null;
}

export const BlogTable = ({
  blogs,
  onEdit,
  onDelete,
  onTogglePin,
  loading,
  editingId
}: BlogTableProps) => {
  if (blogs.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No blog posts found. Add some to get started!
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pinned</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <div className="max-w-xs">
                  <div className="font-medium truncate">{blog.title}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {blog.excerpt}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {blog.category && (
                  <Badge variant="outline" className="text-xs">
                    {blog.category}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(blog.status)}
              </TableCell>
              <TableCell>
                {blog.is_pinned ? (
                  <Pin className="w-4 h-4 text-purple-600" />
                ) : (
                  <PinOff className="w-4 h-4 text-gray-400" />
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {blog.view_count}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onTogglePin(blog.id, blog.is_pinned)}
                    disabled={loading}
                    title={blog.is_pinned ? 'Unpin' : 'Pin'}
                  >
                    {blog.is_pinned ? (
                      <PinOff className="w-4 h-4" />
                    ) : (
                      <Pin className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(blog)}
                    disabled={editingId === blog.id || loading}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(blog.id)}
                    disabled={loading}
                    title="Delete"
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
  );
}; 