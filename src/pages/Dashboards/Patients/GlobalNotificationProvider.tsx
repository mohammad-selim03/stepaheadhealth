import { createContext, useContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
const GlobalNotificationContext = createContext();

export const useGlobalNotification = () => {
  const context = useContext(GlobalNotificationContext);
  if (!context) throw new Error("Must use inside GlobalNotificationProvider");
  return context;
};

export const GlobalNotificationProvider = ({ children }) => {
  const [globalNotifications, setGlobalNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const queryClient = useQueryClient();

  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setUserInfo(JSON.parse(localStorage.getItem("userInfo") || "null"));
      } catch {
        setUserInfo(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!userInfo?.id) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setSocketConnected(true);
      socket.emit("authenticate", { userId: userInfo.id });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setSocketConnected(false);
    });

    socket.on("new_notification", (notification) => {
      console.log("📩 Received notification:", notification);

      const globalNotification = {
        ...notification,
        id: notification.id || `notif_${Date.now()}`,
        createdAt: Date.now(),
        isVisible: true,
      };

      setGlobalNotifications((prev) => [globalNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Auto-remove after 7s
      setTimeout(() => {
        setGlobalNotifications((prev) =>
          prev.filter((n) => n.id !== globalNotification.id)
        );
      }, 7000);

      queryClient.invalidateQueries({ queryKey: ["notification"] });
    });

    return () => {
      socket.disconnect();
      setSocketConnected(false);
    };
  }, [userInfo?.id, queryClient]);

  const addTestNotification = () => {
    const testNotification = {
      id: `test_${Date.now()}`,
      message: "This is a test notification 🚀",
      type: "message",
      user: "Test User",
      createdAt: Date.now(),
      isVisible: true,
    };
    console.log("Adding test notification:", testNotification);
    setGlobalNotifications((prev) => [testNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  return (
    <GlobalNotificationContext.Provider
      value={{
        globalNotifications,
        setGlobalNotifications,
        socketConnected,
        unreadCount,
        setUnreadCount,
        addTestNotification,
      }}
    >
      {children}
    </GlobalNotificationContext.Provider>
  );
};
