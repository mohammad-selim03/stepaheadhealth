import React, { useState } from 'react';
import { Download, Eye, FileText, PlayCircle } from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';

interface Attachment {
  url: string;
  name?: string;
  type?: string;
  size?: number;
}

interface AttachmentPreviewProps {
  attachments: Attachment[];
  isCurrentUser: boolean;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  isCurrentUser
}) => {
  const [previewModal, setPreviewModal] = useState<{ images: Attachment[]; initialIndex: number } | null>(null);

  if (!attachments || attachments.length === 0) return null;

  const images = attachments.filter(att => att.type?.startsWith('image/'));
  const files = attachments.filter(att => !att.type?.startsWith('image/'));

  const handleImageClick = (index: number) => {
    setPreviewModal({ images, initialIndex: index });
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = attachment.name || `file-${Date.now()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type?: string) => {
    if (type?.startsWith('video/')) return <PlayCircle size={20} />;
    return <FileText size={20} />;
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.length === 1 ? (
            // Single image - larger preview like Facebook Messenger
            <div className="relative group max-w-sm">
              <div className="relative overflow-hidden rounded-lg cursor-pointer">
                <img
                  src={images[0].url}
                  alt="attachment"
                  className="max-w-full max-h-80 w-full object-cover transition-transform hover:scale-[1.02]"
                  onClick={() => handleImageClick(0)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(0);
                      }}
                      className="p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(images[0]);
                      }}
                      className="p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : images.length === 2 ? (
            // Two images side by side
            <div className="grid grid-cols-2 gap-1 max-w-sm">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer">
                    <img
                      src={image.url}
                      alt={`attachment ${index + 1}`}
                      className="w-full h-full object-cover transition-transform hover:scale-[1.02]"
                      onClick={() => handleImageClick(index)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(index);
                          }}
                          className="p-1.5 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                          title="Preview"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          className="p-1.5 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 3 ? (
            // Three images: one large, two small
            <div className="grid grid-cols-2 gap-1 max-w-sm h-60">
              <div className="relative group row-span-2">
                <div className="relative h-full overflow-hidden rounded-lg cursor-pointer">
                  <img
                    src={images[0].url}
                    alt="attachment 1"
                    className="w-full h-full object-cover transition-transform hover:scale-[1.02]"
                    onClick={() => handleImageClick(0)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(0);
                        }}
                        className="p-1.5 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(images[0]);
                        }}
                        className="p-1.5 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {images.slice(1, 3).map((image, index) => (
                <div key={index + 1} className="relative group">
                  <div className="relative h-full overflow-hidden rounded-lg cursor-pointer">
                    <img
                      src={image.url}
                      alt={`attachment ${index + 2}`}
                      className="w-full h-full object-cover transition-transform hover:scale-[1.02]"
                      onClick={() => handleImageClick(index + 1)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(index + 1);
                          }}
                          className="p-1 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                          title="Preview"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          className="p-1 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                          title="Download"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Four or more images: 2x2 grid with "+X more" overlay
            <div className="grid grid-cols-2 gap-1 max-w-sm h-60">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-full overflow-hidden rounded-lg cursor-pointer">
                    <img
                      src={image.url}
                      alt={`attachment ${index + 1}`}
                      className="w-full h-full object-cover transition-transform hover:scale-[1.02]"
                      onClick={() => handleImageClick(index)}
                    />
                    {index === 3 && images.length > 4 && (
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center text-white text-lg font-semibold cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        +{images.length - 4}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(index);
                          }}
                          className="p-1 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                          title="Preview"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          className="p-1 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all"
                          title="Download"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Attachments */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isCurrentUser 
                  ? 'bg-white bg-opacity-20 border-white border-opacity-30 hover:bg-opacity-30' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isCurrentUser ? 'bg-white bg-opacity-20' : 'bg-blue-100'
              }`}>
                <div className={isCurrentUser ? 'text-white' : 'text-blue-600'}>
                  {getFileIcon(file.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  isCurrentUser ? 'text-white' : 'text-gray-900'
                }`}>
                  {file.name}
                </p>
                {file.size && (
                  <p className={`text-sm ${
                    isCurrentUser ? 'text-white text-opacity-80' : 'text-gray-500'
                  }`}>
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDownload(file)}
                className={`p-2 rounded-lg transition-colors ${
                  isCurrentUser 
                    ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                }`}
                title="Download"
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewModal && (
        <ImagePreviewModal
          images={previewModal.images}
          initialIndex={previewModal.initialIndex}
          onClose={() => setPreviewModal(null)}
        />
      )}
    </div>
  );
};

export default AttachmentPreview;