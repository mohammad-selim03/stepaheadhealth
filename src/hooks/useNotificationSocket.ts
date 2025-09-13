 
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast'; // or your toast library

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const useNotificationSocket = () => {
  const socketRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  useEffect(() => {
    if (!userInfo?.id) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Global notification socket connected:", socket.id);
      socket.emit("authenticate", { userId: userInfo.id });
    });

    // Listen for real-time notifications globally
    socket.on("new_notification", (notification) => {
      console.log("Received new notification:", notification);
      
      // Show toast notification on ANY page
      toast.success(notification.message || "New notification received", {
        duration: 4000,
        position: "top-right",
        icon: "🔔",
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userInfo?.id]);

  return socketRef.current;
};