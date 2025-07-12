import React from 'react';
import { Button } from '@/components/ui/button';

interface BannerFormProps {
  form: { title: string; description: string; image_url: string; order_index: number; is_active: boolean };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  editing: boolean;
  onCancel?: () => void;
}

const BANNER_WIDTH = 1200;
const BANNER_HEIGHT = 600;

export default function BannerForm({ form, onChange, onSubmit, editing, onCancel }: BannerFormProps) {
  // Drag and drop logic for image URL (simulate, since actual upload is not implemented)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text/plain');
    if (url) {
      onChange({
        target: { name: 'image_url', value: url },
      } as any);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="mb-6">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={onChange}
        className="border rounded px-2 py-1 mr-2"
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={onChange}
        className="border rounded px-2 py-1 mr-2"
      />
      <div
        className="border-2 border-dashed border-gray-400 rounded px-2 py-4 mb-2 text-center relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ minWidth: 320 }}
      >
        <div className="text-gray-500 mb-1">Drag & drop banner image URL here</div>
        <div className="text-xs text-gray-400">Recommended size: {BANNER_WIDTH}x{BANNER_HEIGHT}px</div>
        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={onChange}
          className="border rounded px-2 py-1 mt-2 w-full"
        />
      </div>
      <Button onClick={onSubmit} className="bg-solar-primary text-white px-4 py-2 rounded">
        {editing ? 'Update' : 'Add'}
      </Button>
      {editing && onCancel && (
        <Button onClick={onCancel} className="ml-2">Cancel</Button>
      )}
    </div>
  );
} 