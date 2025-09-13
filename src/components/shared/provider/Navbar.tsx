import { Link, useNavigate } from "react-router";
import { Dropdown, Popover } from "antd";
import { useContext } from "react";
import { MainContext } from "../../../provider/ContextProvider";
import Hamburger from "hamburger-react";
import {
  AlretSvg,
  LogoutSvg,
  MessageboxSvg,
  SpanishSvg,
} from "../../../assets/svgContainer";
import { GetData, PostData } from "../../../api/API";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import { imageProvider } from "../../../lib/imageProvider";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { handleLogOut } from "./Sidebar";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";

// Socket.IO configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const NotificationContent = ({ unreadCount, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);

  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notification"],
    queryFn: () => GetData("notifications?limit=1000000"),
    refetchOnWindowFocus: false,
  });

  // Initialize socket connection for notifications
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

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Notification socket connected:", socket.id);
      setSocketConnected(true);

      // Authenticate user for notifications
      socket.emit("authenticate", {
        userId: userInfo.id,
      });

      console.log("User authenticated for notifications:", userInfo.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Notification socket disconnected:", reason);
      setSocketConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Notification socket connection error:", error);
      setSocketConnected(false);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(
        "Notification socket reconnected after",
        attemptNumber,
        "attempts"
      );
      setSocketConnected(true);

      // Re-authenticate on reconnection
      socket.emit("authenticate", {
        userId: userInfo.id,
      });
    });

    // Listen for real-time notifications
    socket.on("new_notification", (notification) => {
      console.log("Received new notification:", notification);

      // Add new notification to the list
      setNotifications((prev) => [notification, ...prev]);

      // Update unread count
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      toast.success(notification.message || "New notification received", {
        duration: 4000,
        position: "top-right",
        icon: "🔔",
      });

      // Invalidate and refetch notifications to keep in sync
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    });

    // Listen for notification updates (like mark as read)
    socket.on("notification_updated", (updatedNotification) => {
      console.log("Notification updated:", updatedNotification);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === updatedNotification.id ? updatedNotification : notif
        )
      );

      // Update unread count if notification was marked as read (check both properties)
      if (updatedNotification.read || updatedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    });

    // Listen for bulk notification updates
    socket.on("notifications_marked_read", (notificationIds) => {
      console.log("Multiple notifications marked as read:", notificationIds);

      setNotifications((prev) =>
        prev.map((notif) =>
          notificationIds.includes(notif.id)
            ? { ...notif, read: true, isRead: true }
            : notif
        )
      );

      setUnreadCount(0);

      // Refetch to keep in sync
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    });

    socket.on("error", (error) => {
      console.error("Notification socket error:", error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
    };
  }, [userInfo?.id, queryClient]);

  // Update local state when data changes
  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications);

      // Calculate unread count (check both 'read' and 'isRead' properties)
      const unreadNotifications = data.notifications.filter(
        (notif) => !notif.isRead
      );
      setUnreadCount(unreadNotifications.length);
    }
  }, [data]);

  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      // Optimistically update UI (set both properties for compatibility)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, read: true, isRead: true }
            : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Make API call to mark specific notification as read
      const response = await PostData(
        `notifications/${notificationId}/read`,
        {},
        "patch"
      );

      // Update the specific notification with the response data
      if (response?.data) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, ...response.data } : notif
          )
        );
      }

      // Emit socket event to notify server
      if (socketRef.current && socketConnected) {
        socketRef.current.emit("mark_notification_read", {
          notificationId,
          userId: userInfo.id,
        });
      }

      // Invalidate query to sync with server
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    } catch (error) {
      console.error("Error marking notification as read:", error);

      // Revert optimistic update on error (set both properties)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, read: false, isRead: false }
            : notif
        )
      );
      setUnreadCount((prev) => prev + 1);

      // Show error toast
      toast.error("Failed to mark notification as read");
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Store original state for rollback
      const originalNotifications = [...notifications];
      const originalUnreadCount = unreadCount;

      // Optimistically update UI (set both properties for compatibility)
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true, isRead: true }))
      );
      setUnreadCount(0);

      // Make API call to mark all notifications as read
      await PostData("notifications/read-all", {}, "patch");

      // Emit socket event
      if (socketRef.current && socketConnected) {
        socketRef.current.emit("mark_all_notifications_read", {
          userId: userInfo.id,
        });
      }

      // Invalidate query to sync with server
      queryClient.invalidateQueries({ queryKey: ["notification"] });

      // Show success toast
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);

      // Revert optimistic update on error
      setNotifications(originalNotifications);
      setUnreadCount(originalUnreadCount);

      // Show error toast
      toast.error("Failed to mark all notifications as read");

      // Refetch on error to restore correct state
      refetch();
    }
  };

  // Format time helper function
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";

    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

    return past.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-[280px] max-h-[500px] overflow-y-auto mx-auto">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl lg:text-[32px] font-nerisSemiBold text-textPrimary">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </h1>

          {/* Connection Status Indicator */}
          {/* <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              socketConnected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                socketConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            {socketConnected ? "Live" : "Offline"}
          </div> */}
        </div>

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Mark all as read ({unreadCount})
          </button>
        )}

        {isLoading ? (
          <p className="flex items-center justify-center h-40">
            <Loader color="#000000" />
          </p>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>Error loading notifications</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
          </div>
        ) : notifications.length < 1 ? (
          <div className="text-center text-gray-500 p-8">
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-[#F2F8FF] rounded-lg transition cursor-pointer relative ${
                  !note.read && !note.isRead
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() =>
                  !note.read && !note.isRead && markAsRead(note.id)
                }
              >
                {/* Unread indicator */}
                {!note.read && !note.isRead && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}

                {/* Avatar (if available) */}
                {note.avatar && (
                  <img
                    src={note.avatar}
                    alt={note.user || "User"}
                    className="w-5 h-5 sm:w-8 sm:h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                )}

                <div className="flex-1">
                  <p className="font-Poppins sm:text-sm text-[10px] text-textPrimary">
                    {note.user && (
                      <span className="font-semibold">{note.user} </span>
                    )}
                    {note.message}
                  </p>
                  <p className="sm:text-xs text-[8px] font-Poppins text-textSecondary mt-1">
                    {formatTime(note.createdAt || note.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const context = useContext(MainContext);
  const { t, i18n } = useTranslation();
  if (!context) {
    throw new Error("MainContext must be used within a ContextProvider");
  }
  const [selectedImg, setSelectedImg] = useState(
    <img src={imageProvider.american_flag} alt="" className="h-6 rounded-md" />
  );

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "es") {
      setSelectedImg(<SpanishSvg />);
    } else {
      setSelectedImg(
        <img
          src={imageProvider.american_flag}
          alt=""
          className="h-5 rounded-md"
        />
      );
    }
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            setSelectedImg(
              <img
                src={imageProvider.american_flag}
                alt=""
                className="h-5 rounded-md"
              />
            );
            i18n.changeLanguage("en");
            localStorage.setItem("lang", "en");
          }}
        >
          <div className="w-8 h-8">
            <img
              src={imageProvider.american_flag}
              alt=""
              className="h-5 rounded-md"
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            setSelectedImg(<SpanishSvg />);
            i18n.changeLanguage("es");
            localStorage.setItem("lang", "es");
          }}
        >
          <div className="w-8 h-8">
            <SpanishSvg />
          </div>
        </div>
      ),
    },
  ];

  const { step, setStep } = context;

  const toggleSidebar = () => {
    setStep(step === 1 ? 0 : 1);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["clinician-profile"],
    queryFn: () => GetData("clinician/profile"),
    staleTime: 2000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 1, // Reduce retries for faster failure feedback
  });

  const { data: notification } = useQuery({
    queryKey: ["notification"],
    queryFn: () => GetData("notifications?limit=100000"),
    // refetchInterval: 2000
  });

  const count = notification?.notifications?.filter(
    (not) => not?.isRead === false
  );

  console.log("cu", count, notification?.unreadCount);

  return (
    <div className="py-4 px-2">
      <div className="flex justify-between gap-10 items-center ps-14">
        <div>
          <Link to="/">
            <img
              className="w-[180px] h-[42px]"
              src={imageProvider.logo}
              alt="App Logo"
            />
          </Link>
        </div>
        {/* Mobile Hamburger Menu */}
        <div className="xl:hidden block">
          <Hamburger
            toggled={step === 1}
            size={25}
            toggle={toggleSidebar}
            aria-label="Toggle sidebar"
          />
        </div>

        {/* Right Side Icons */}
        <div className="flex gap-5 items-center justify-end w-full">
          <div className="flex items-center gap-10">
            <Dropdown menu={{ items }}>
              <div className="flex gap-2 items-center cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  {selectedImg}
                </div>
                <DownOutlined style={{ color: "black" }} />
              </div>
            </Dropdown>
          </div>
          {/* Messages */}
          <div className="border border-[#E5E5E5] bg-white rounded-2xl p-3 cursor-pointer hover:bg-gray-50 transition">
            <Link to="/provider-messages" aria-label="Messages">
              <MessageboxSvg />
            </Link>
          </div>

          {/* Notifications */}
          <Popover
            content={
              <NotificationContent
                setUnreadCount={setUnreadCount}
                unreadCount={unreadCount}
              />
            }
            trigger="click"
            placement="bottom"
          >
            <div className="relative border border-[#E5E5E5] bg-white rounded-2xl p-3 cursor-pointer hover:bg-gray-50 transition">
              {/* <AlretSvg /> */}
              <AlretSvg />
              <p className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full">
                {notification?.unreadCount || "0"}
              </p>
            </div>
          </Popover>

          {/* Divider */}
          <div className="hidden md:block">
            <hr className="border border-[#E5E5E5] h-12" />
          </div>

          {/* Profile Picture */}
          <div className="cursor-pointer">
            <Popover
              content={<Info data={data} />}
              trigger="click"
              placement="bottom"
            >
              <div>
                <img
                  className="w-[46px] h-[46px] object-cover object-top rounded-full "
                  src={
                    data?.avatar === null
                      ? imageProvider?.defaultImg
                      : data?.avatar
                  }
                  alt="User profile"
                />
              </div>
            </Popover>
            {/* <img
              className="w-[46px] h-[46px] object-cover object-top rounded-full border border-[#E5E5E5]"
              src={
                data?.avatar === null ? imageProvider?.defaultImg : data?.avatar
              }
              alt="User profile"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const Info = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="">
        <div className="flex items-center space-x-4">
          <div>
            <p className="font-semibold text-lg text-gray-800">
              {data?.firstName} {data?.lastName}
            </p>
            <p className="text-sm text-textPrimary">{data?.email}</p>
          </div>
        </div>
      </div>

      <div className="pt-4 hover:bg-gray-50 cursor-pointer transition-all duration-300">
        <div
          className="flex items-center gap-2 text-red-500 hover:text-primaryColor"
          onClick={() => {
            handleLogOut();
            navigate("/");
          }}
        >
          <LogoutSvg className="w-5 h-5 text-red-500" />
          <span className="font-medium text-sm">Log Out</span>
        </div>
      </div>
    </div>
  );
};
