import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const useSocket = (
  userInfo: any,
  activeConversation: any,
  currentUserId: string
) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userInfo?.id) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("authenticate", { userId: userInfo.id });
    });

    socket.on("disconnect", (reason) => {
      setSocketConnected(false);
      if (reason === "io server disconnect") socket.connect();
    });

    socket.on("connect_error", (error) => {
      setSocketConnected(false);
      toast.error("Failed to connect to chat server");
    });

    socket.on("reconnect", () => {
      setSocketConnected(true);
      socket.emit("authenticate", { userId: userInfo.id });
      if (activeConversation?.id) {
        socket.emit("join_conversation", activeConversation.id);
      }
      toast.success("Reconnected to chat server");
    });

    if (activeConversation?.id) {
      socket.emit("join_conversation", activeConversation.id);
    }

    socket.on("receive_message", (messageData) => {
      const newMessage = messageData.message || messageData;

      if (newMessage.conversationId === activeConversation?.id) {
        queryClient.setQueryData(
          ["messages-list", activeConversation.id],
          (old: any) => {
            const existingMessages = old?.messages || [];
            const messageExists = existingMessages.some(
              (msg: any) => msg.id === newMessage.id
            );

            if (!messageExists) {
              return {
                ...old,
                messages: [...existingMessages, newMessage],
              };
            }
            return old;
          }
        );
      }

      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      const messageSenderId = newMessage.sender?.id;
      if (messageSenderId && messageSenderId !== currentUserId) {
        const senderProfile =
          newMessage.sender.clinicianProfile ||
          newMessage.sender.patientProfile;
        const senderName = senderProfile
          ? `${senderProfile.firstName} ${senderProfile.lastName}`
          : "Someone";
        toast.success(`New message from ${senderName}`, {
          duration: 4000,
          position: "top-right",
          icon: "💬",
        });
      }
    });

    socket.on("user_typing", ({ userId, conversationId, isTyping }) => {
      if (conversationId === activeConversation?.id && userId !== userInfo.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (isTyping) newSet.add(userId);
          else newSet.delete(userId);
          return newSet;
        });
      }
    });

    return () => {
      if (activeConversation?.id) {
        socket.emit("leave_conversation", activeConversation.id);
      }
      socket.disconnect();
    };
  }, [userInfo?.id, activeConversation?.id, currentUserId, queryClient]);

  return {
    socket: socketRef.current,
    socketConnected,
    onlineUsers,
    typingUsers,
    setTypingUsers,
  };
};
