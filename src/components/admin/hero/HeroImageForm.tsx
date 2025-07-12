
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Check } from 'lucide-react';
import { HeroImageForm as HeroImageFormType } from './types';
import { FileUploadArea } from './FileUploadArea';

interface HeroImageFormProps {
  formData: HeroImageFormType;
  onInputChange: (field: keyof HeroImageFormType, value: string | number | boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  uploading: boolean;
  isEdit?: boolean;
  title: string;
  onFileUpload: (file: File) => void;
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  uploadedImageUrl?: string;
}

export const HeroImageForm = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  loading,
  uploading,
  isEdit = false,
  title,
  onFileUpload,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  uploadedImageUrl
}: HeroImageFormProps) => {
  const canSubmit = !loading && !uploading && formData.image_url && formData.title.trim();

  return (
    <Card className={`mb-6 ${isEdit ? 'border-blue-200 bg-blue-50' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-lg ${isEdit ? 'text-blue-800' : ''}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploadArea
          onFileUpload={onFileUpload}
          uploading={uploading}
          dragActive={dragActive}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          uploadedImageUrl={uploadedImageUrl}
          currentImageUrl={formData.image_url}
          isEdit={isEdit}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="Hero image title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL (or upload above)</label>
            <Input
              value={formData.image_url}
              onChange={(e) => onInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Hero image description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA Text</label>
            <Input
              value={formData.cta_text}
              onChange={(e) => onInputChange('cta_text', e.target.value)}
              placeholder="Learn More"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA Link</label>
            <Input
              value={formData.cta_link}
              onChange={(e) => onInputChange('cta_link', e.target.value)}
              placeholder="/about"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Order Index</label>
            <Input
              type="number"
              value={formData.order_index}
              onChange={(e) => onInputChange('order_index', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={isEdit ? "edit_is_active" : "is_active"}
              checked={formData.is_active}
              onChange={(e) => onInputChange('is_active', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor={isEdit ? "edit_is_active" : "is_active"} className="text-sm font-medium">
              Active
            </label>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={onSubmit} 
            disabled={!canSubmit}
            className={isEdit ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {isEdit ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Save Changes' : 'Save'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
