import React, { useState } from "react";
import type { Message } from "react-hook-form";
import { DownloadSvg } from "../../../Generals/Home/HomeIcons";

interface MessageItemProps {
  msg: Message;
  isCurrentUser: boolean;
  currentUserRole: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  msg,
  isCurrentUser,
  currentUserRole,
}) => {
  const profile = msg.sender?.clinicianProfile || msg.sender?.patientProfile;
  const [imageError, setImageError] = useState(false);

  // Function to handle image download
  const handleDownload = async (url: string, filename: string) => {
    try {
      // For external URLs, we need to handle CORS properly
      if (url.startsWith("http")) {
        // Create a temporary anchor tag for download
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.download = filename || "download";

        // For cross-origin URLs, we need to open in new tab
        if (url.startsWith("http") && !url.includes(window.location.origin)) {
          window.open(url, "_blank");
        } else {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    e.currentTarget.style.display = "none";
  };

  // Function to handle image load success
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(false);
  };

  return (
    <div
      className={`flex gap-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isCurrentUser && profile?.avatar && (
        <div className="flex items-end">
          <img
            className="w-9 h-9 object-cover rounded-full"
            src={profile.avatar}
            alt={`${profile.firstName} ${profile.lastName}`}
            onError={handleImageError}
          />
        </div>
      )}

      <div
        className={`rounded-xl px-4 py-2 max-w-[90%] text-sm md:text-base ${
          isCurrentUser
            ? "bg-primaryColor text-white"
            : "bg-white text-textPrimary border border-gray-200"
        }`}
      >
        {msg?.content && (
          <p className="font-Poppins font-light">{msg.content}</p>
        )}

        {msg?.attachments?.length > 0 && (
          <div className="mt-2">
            {msg?.attachments?.map((attachment: any, i: number) => (
              <div key={i} className="mb-3">
                {attachment.type?.startsWith("image/") ||
                attachment.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <div className="relative inline-block">
                    {/* <img
                      src={attachment.url}
                      alt="attachment"
                      className="max-w-full max-h-40 rounded-md cursor-pointer"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      onClick={() => window.open(attachment.url, '_blank')}
                    /> */}
                    <img
                      src={attachment.previewUrl || attachment.url}
                      alt="attachment"
                      className="max-w-full max-h-40 rounded-md cursor-pointer"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      onClick={() =>
                        window.open(
                          attachment.previewUrl || attachment.url,
                          "_blank"
                        )
                      }
                    />

                    {!imageError && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(
                            attachment.url || attachment.previewUrl,
                            attachment.name || "image"
                          );
                        }}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                        title="Download image"
                      >
                        <DownloadSvg className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                  </div>
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600 transition-colors duration-200"
                    download
                  >
                    <DownloadSvg className="w-4 h-4" />
                    <span>{attachment.name || "Download file"}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <p
          className={`text-xs mt-1 ${
            isCurrentUser ? "text-white/80" : "text-gray-500"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isCurrentUser && profile?.avatar && (
        <div className="flex items-end">
          <img
            className="w-9 h-9 object-cover rounded-full"
            src={profile.avatar}
            alt="You"
            onError={handleImageError}
          />
        </div>
      )}
    </div>
  );
};
