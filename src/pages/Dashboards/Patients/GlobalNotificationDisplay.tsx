import React from "react";
import { useGlobalNotification } from "./GlobalNotificationProvider";
import { Bell, CheckCircle, User, X } from "lucide-react";

const GlobalNotificationDisplay = () => {
  const {
    globalNotifications,
    setGlobalNotifications,
    addTestNotification,
  } = useGlobalNotification();

  const formatTime = (ts) => {
    const now = Date.now();
    const seconds = Math.floor((now - ts) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <User className="w-5 h-5 text-blue-500" />;
      case "appointment":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "alert":
        return <Bell className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const removeNotification = (id) =>
    setGlobalNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <>
      {/* Floating Test Button */}
      {/* <button
        onClick={addTestNotification}
        className="fixed bottom-4 right-4 px-3 py-2 bg-blue-600 text-white rounded shadow"
      >
        Test Notification
      </button> */}

      {/* Notification Stack */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
        {globalNotifications.slice(0, 3).map((n) => (
          <div
            key={n.id}
            className="bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 animate-slide-in"
          >
            <div className="flex gap-3">
              {getIcon(n.type)}
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">{n.user || "System"}</span>
                  <span className="text-xs text-gray-500">
                    {formatTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{n.message}</p>
              </div>
              <button onClick={() => removeNotification(n.id)}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-1 bg-blue-500 animate-progress" />
            </div>
          </div>
        ))}

        {/* Animations */}
        <style>{`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in { animation: slide-in 0.4s ease-out; }
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
          .animate-progress { animation: progress 7s linear forwards; }
        `}</style>
      </div>
    </>
  );
};

export default GlobalNotificationDisplay;
