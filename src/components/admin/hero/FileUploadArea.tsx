
import { useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

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
  const hasImage = displayImageUrl && displayImageUrl.trim() !== '';

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : hasImage
            ? 'border-green-300 bg-green-50'
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
        
        {hasImage ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-green-600 mb-4">
              <CheckCircle className="w-8 h-8 mr-2" />
              <span className="font-medium">Image Ready</span>
            </div>
            
            <div className="relative inline-block">
              <img 
                src={displayImageUrl} 
                alt="Preview" 
                className="mx-auto max-h-48 max-w-full rounded-lg border-2 border-green-200 shadow-sm"
                onError={(e) => {
                  console.error('Image preview error:', e);
                  e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Preview+Error';
                  e.currentTarget.className = 'mx-auto max-h-48 max-w-full rounded-lg border-2 border-red-200 shadow-sm';
                }}
                onLoad={() => console.log('Image preview loaded successfully:', displayImageUrl)}
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                ✓
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Image URL: {displayImageUrl}</p>
              {uploadedImageUrl && (
                <p className="text-green-600 font-medium">✓ New image uploaded successfully!</p>
              )}
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Uploading...</p>
          </div>
        )}
      </div>
      
      {hasImage && (
        <div className="flex justify-center space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {isEdit ? 'Replace Image' : 'Change Image'}
          </button>
          {uploadedImageUrl && (
            <span className="text-sm text-green-600">✓ Uploaded successfully</span>
          )}
        </div>
      )}
    </div>
  );
};
