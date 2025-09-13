import { useState, useCallback, useRef } from "react";

export const useMessages = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      const newAttachments = Array.from(filesList).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
        size: file.size,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    if (attachments[index]?.previewUrl) {
      URL.revokeObjectURL(attachments[index].previewUrl);
    }
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAttachments = () => {
    attachments.forEach((attachment) => {
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    });
    setAttachments([]);
  };

  const handleTyping = useCallback((socket: any, activeConversation: any, userInfo: any, socketConnected: boolean) => {
    if (!socket || !activeConversation?.id || !socketConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId: activeConversation.id,
        userId: userInfo.id,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socket && activeConversation?.id && socketConnected) {
        setIsTyping(false);
        socket.emit("typing", {
          conversationId: activeConversation.id,
          userId: userInfo.id,
          isTyping: false,
        });
      }
    }, 3000);
  }, [isTyping]);

  return {
    message,
    setMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    attachments,
    setAttachments,
    isTyping,
    handleFileChange,
    removeFile,
    clearAttachments,
    handleTyping
  };
};