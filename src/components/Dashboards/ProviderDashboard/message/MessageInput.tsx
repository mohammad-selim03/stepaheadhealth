import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react"; 
import { CameraSvg, LinkSvg, SendSvg } from "../../../../assets/svgContainer";
import { imageProvider } from "../../../../lib/imageProvider";
import Loader from "../../../common/Loader";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  attachments: any[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => void;
  removeFile: (index: number) => void;
  clearAttachments: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleEmojiClick: (emojiData: EmojiClickData) => void;
  handleSendMessage: () => void;
  handleTyping: () => void;
  isPending: boolean;
  isMobile?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  attachments,
  handleFileChange,
  removeFile,
  clearAttachments,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  handleSendMessage,
  handleTyping,
  isPending,
  isMobile = false
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
    clearAttachments();
    setImageErrors(new Set()); // Clear image errors on submit
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      clearAttachments();
      setImageErrors(new Set());
    }
  };

  return (
    <form
      className="flex items-center gap-3 mt-5 relative w-full flex-wrap"
      onSubmit={handleSubmit}
    >
      <label className="cursor-pointer">
        <CameraSvg />
        <input
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileChange(e, "image")}
        />
      </label>

      <label className="cursor-pointer">
        <LinkSvg />
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e, "file")}
        />
      </label>

      <div className="text-textSecondary border border-[#5A5C5F] bg-white py-2 px-4 rounded-2xl relative flex-1 min-w-[200px]">
        {attachments.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-2 max-w-full pb-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-[60px] h-[60px] rounded overflow-hidden border border-gray-300 group"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile(index);
                  }}
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-bl px-1.5 py-0.5 text-xs z-10 transition-colors duration-200"
                >
                  ×
                </button>
                
                {attachment.type === "image" && !imageErrors.has(index) ? (
                  <img
                    src={attachment.previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(attachment.previewUrl)}
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-xs px-1 text-gray-600 break-words text-center">
                    {attachment.name.length > 10 
                      ? `${attachment.name.substring(0, 8)}...` 
                      : attachment.name
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Write your message"
          className="focus:outline-none w-full bg-transparent"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
        />
        
        <div
          className="absolute top-2.5 right-3 cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <img
            className="w-5 h-5 object-cover"
            src={imageProvider.Emoji}
            alt="emoji"
          />
        </div>
      </div>

      <button
        type="submit"
        className="cursor-pointer -ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending || (!message.trim() && attachments.length === 0)}
      >
        {isPending ? (
          <Loader size={4} color="#000000" />
        ) : (
          <SendSvg />
        )}
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-16 right-10 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </form>
  );
};