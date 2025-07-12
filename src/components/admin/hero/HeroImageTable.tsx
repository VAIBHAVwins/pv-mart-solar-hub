
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit } from 'lucide-react';
import { HeroImage } from './types';

interface HeroImageTableProps {
  heroImages: HeroImage[];
  onEdit: (image: HeroImage) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  editingId: string | null;
}

export const HeroImageTable = ({
  heroImages,
  onEdit,
  onDelete,
  loading,
  editingId
}: HeroImageTableProps) => {
  if (heroImages.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hero images found. Add some to get started!
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

  return (
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
                    onClick={() => onEdit(image)}
                    disabled={editingId === image.id || loading}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(image.id)}
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
  );
};
