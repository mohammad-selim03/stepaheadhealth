import React, { useState } from 'react';
import { Download, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePreviewModalProps {
  images: Array<{
    url: string;
    name?: string;
    type?: string;
  }>;
  initialIndex: number;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  images,
  initialIndex,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async (attachment: any) => {
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = attachment.name || `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="relative max-w-6xl max-h-full w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-white">
            <h3 className="text-lg font-semibold truncate max-w-md">
              {currentImage.name || 'Image'}
            </h3>
            <p className="text-sm text-gray-300">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload(currentImage)}
              className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center relative">
          {images.length > 1 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all z-10"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <img
            src={currentImage.url}
            alt={currentImage.name || 'Preview'}
            className="max-w-full max-h-full object-contain rounded-lg"
          />

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2 px-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                    : 'border-white border-opacity-30 hover:border-opacity-60'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;