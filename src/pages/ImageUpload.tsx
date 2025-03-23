
import React from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';

const ImageUpload: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto mt-8 text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Image Upload
          </h1>
          <p className="text-gray-600">
            Upload images of medications for identification and information retrieval
          </p>
        </div>
        <ImageUploader />
      </div>
    </div>
  );
};

export default ImageUpload;
