
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useHeroImageManager } from './hero/useHeroImageManager';
import { HeroImageForm } from './hero/HeroImageForm';
import { HeroImageTable } from './hero/HeroImageTable';

const HeroImageManager = () => {
  const {
    heroImages,
    loading,
    error,
    success,
    editingId,
    showAddForm,
    uploading,
    dragActive,
    uploadedImageUrl,
    formData,
    setShowAddForm,
    handleFileUpload,
    handleDrag,
    handleDrop,
    addHeroImage,
    deleteHeroImage,
    startEditing,
    cancelEditing,
    saveEdit,
    handleInputChange,
    resetForm
  } = useHeroImageManager();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Images Management</CardTitle>
          <CardDescription>
            Manage homepage banner images and content. Upload local images or use external URLs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Hero Images ({heroImages.length})</h3>
            <Button 
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showAddForm) resetForm();
              }}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Image
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <HeroImageForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={addHeroImage}
              onCancel={() => {
                setShowAddForm(false);
                resetForm();
              }}
              loading={loading}
              uploading={uploading}
              title="Add New Hero Image"
              onFileUpload={handleFileUpload}
              dragActive={dragActive}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              uploadedImageUrl={uploadedImageUrl}
            />
          )}

          {/* Edit Form */}
          {editingId && (
            <HeroImageForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={saveEdit}
              onCancel={cancelEditing}
              loading={loading}
              uploading={uploading}
              isEdit={true}
              title="Edit Hero Image"
              onFileUpload={handleFileUpload}
              dragActive={dragActive}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              uploadedImageUrl={uploadedImageUrl}
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
          <HeroImageTable
            heroImages={heroImages}
            onEdit={startEditing}
            onDelete={deleteHeroImage}
            loading={loading}
            editingId={editingId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroImageManager;
