import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// Icons as SVG components
const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface ProfilePictureProps {
  avatar?: string;
  onAvatarChange?: (url: string) => void;
}

const ProfilePicture = ({ avatar, onAvatarChange }: ProfilePictureProps) => {
  const { t } = useTranslation("providerdashboard");
  const [currentAvatar, setCurrentAvatar] = useState<string>(avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showHover, setShowHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentAvatar(avatar || "");
  }, [avatar]);

 

  const beforeUpload = (file: File): boolean => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      showMessage(t("you_can_only_upload_image_files"), 'error');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      showMessage(t("image_must_smaller_than_5mb"), 'error');
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!beforeUpload(file)) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("avatar", file);

    const token = JSON.parse(localStorage.getItem("token") || "null");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/clinician/profile/avatar`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data?.success && data?.data?.avatarUrl) {
        const newAvatarUrl = data.data.avatarUrl;
        setCurrentAvatar(newAvatarUrl);

        if (onAvatarChange) {
          onAvatarChange(newAvatarUrl);
        }

        // Update query cache
        queryClient.setQueryData(["clinician-profile"], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              avatar: newAvatarUrl,
            };
          }
          return oldData;
        });

        queryClient.invalidateQueries({
          queryKey: ["clinician-profile"],
          refetchType: "active",
        });

        showMessage(t("avatar_uploaded_successfully"), 'success');
      } else {
        showMessage(t("failed_to_upload_avatar"), 'error');
      }
    } catch (error) {
      console.error("Upload error:", error);
      showMessage(t("failed_to_upload_avatar"), 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset input value to allow same file selection
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleReupload = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    // Force update the current avatar immediately
    setCurrentAvatar("");
    
    if (onAvatarChange) {
      onAvatarChange("");
    }
    
    // Update query cache if queryClient is provided
    if (queryClient) {
      queryClient.setQueryData(["clinician-profile"], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            avatar: "",
          };
        }
        return oldData;
      });
    }
    
    showMessage("Avatar removed successfully", 'success');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="my-10">
      <div className="max-w-[1480px] mx-auto px-2">
        <p className="text-textPrimary font-nerisSemiBold text-xl w-fit mx-auto mb-6">
          {t("profile_picture")}
        </p>
        
        <div className="flex justify-center">
          <div className="relative">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Upload area */}
            <div
              className={`relative w-80 h-80 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={!currentAvatar && !isUploading ? triggerFileInput : undefined}
              onMouseEnter={() => currentAvatar && setShowHover(true)}
              onMouseLeave={() => setShowHover(false)}
            >
              {currentAvatar ? (
                <>
                  {/* Avatar image */}
                  <img
                    src={currentAvatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                  
                  {/* Hover overlay */}
                  {showHover && !isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center space-x-4 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReupload();
                        }}
                        className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-200"
                        title="Reupload"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-200"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                  ) : (
                    <>
                      <UploadIcon />
                      <p className="text-center text-sm font-medium max-w-24">
                        {dragOver ? "Drop here" : t("drag_and_drop_a_file_here_or_click_to_upload")}
                      </p>
                    </>
                  )}
                </div>
              )}
              
              {/* Loading overlay */}
              {isUploading && currentAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upload instructions */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Support JPG, PNG, GIF up to 5MB</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;