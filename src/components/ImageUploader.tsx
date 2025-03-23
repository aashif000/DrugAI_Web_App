
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Image, Upload, X, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ImageUploader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // File type validation
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // File size validation (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size exceeds 10MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          setIsUploading(false);
          toast.success('Image uploaded successfully');
        }, 500);
      }
      setUploadProgress(progress);
    }, 300);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
              isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300",
              selectedImage ? "bg-slate-50" : ""
            )}
            onClick={() => !selectedImage && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
            />
            
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="max-h-80 mx-auto rounded-md object-contain shadow-sm img-hover-effect"
                />
                
                <div className="absolute top-2 right-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1 text-xs text-slate-500">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {!isUploading && (
                  <div className="mt-4 flex justify-center gap-3">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      variant="outline"
                      className="gap-1"
                    >
                      <RotateCw className="h-4 w-4" />
                      Select Another
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        simulateUpload();
                      }}
                      className="gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-500 mb-4">
                  <Image className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-1">Upload Image</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-xs text-slate-400">
                  Supports: JPEG, PNG, GIF, WebP (Max: 10MB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-sm text-slate-500 text-center">
        <p>This image uploader is a front-end demonstration that simulates the upload process.</p>
        <p className="mt-1">In a real application, images would be securely stored on a server or cloud service.</p>
      </div>
    </div>
  );
};

export default ImageUploader;
