
import { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FileUploadAreaProps {
  onFileUpload: (file: File) => void;
  uploading: boolean;
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  uploadedImageUrl?: string;
  currentImageUrl?: string;
  isEdit?: boolean;
}

export const FileUploadArea = ({
  onFileUpload,
  uploading,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  uploadedImageUrl,
  currentImageUrl,
  isEdit = false
}: FileUploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const displayImageUrl = uploadedImageUrl || currentImageUrl;

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
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

        {displayImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-green-600 mb-2">✓ Image ready</p>
            <div className="relative inline-block">
              <img 
                src={displayImageUrl} 
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
};
