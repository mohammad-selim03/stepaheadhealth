import {
  CameraSvg,
  LinkSvg,
  RightArraySvg,
  SearchSvg,
  SendSvg,
  StarSvg,
} from "../../../../assets/svgContainer";
import { imageProvider } from "../../../../lib/imageProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import toast from "react-hot-toast";
import { useSendMessage } from "./useSendMessage";
import Loader from "../../../common/Loader";
import { io, Socket } from "socket.io-client";

// Socket.IO configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

interface Attachment {
  file: File;
  previewUrl: string;
  type: "image" | "file";
  name: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  conversationId?: string;
  sender: {
    id?: string;
    role: string;
    clinicianProfile?: any;
    patientProfile?: any;
  };
  attachments?: any[];
}

export function getTimeAgo(timestamp: string): string {
  if (!timestamp) return "Just now";

  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) return "Just now";

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"}`;
    }
  }

  return "Just now";
}

const Message = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [showIcon, setShowIcon] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const queryClient = useQueryClient();

  const currentUserRole = userInfo?.role;
  const currentUserId = userInfo?.id;

  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => GetData(`chat/user`),
  });
  const [activeConversation, setActiveConversation] = useState(
    conversations?.[0]
  );
  // const activeConversation = conversations?.[0];

  // Modified messages query to include pagination
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messageError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages-list", activeConversation?.id, currentPage],
    queryFn: () =>
      GetData(
        `chat/${activeConversation?.id}/messages?page=${currentPage}&limit=20`
      ),
    enabled: !!activeConversation?.id,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  console.log("Messages data:", messagesData);
  console.log("All messages state:", allMessages);

  // Function to scroll to bottom smoothly - only within chat container
  const scrollToBottom = useCallback(
    (behavior: "auto" | "smooth" = "smooth") => {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: behavior,
          });
        }
      }, 100);
    },
    []
  );

  // Socket.IO initialization and cleanup
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
      console.log("Connected to server:", socket.id);
      setSocketConnected(true);

      // Authenticate user for notifications
      socket.emit("authenticate", {
        userId: userInfo.id,
      });

      // toast.success("Connected to chat server");
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setSocketConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setSocketConnected(false);
      toast.error("Failed to connect to chat server");
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Reconnected to server after", attemptNumber, "attempts");
      setSocketConnected(true);

      // Re-authenticate on reconnection
      socket.emit("authenticate", {
        userId: userInfo.id,
      });

      // Rejoin conversation if there's an active one
      if (activeConversation?.id) {
        socket.emit("join_conversation", activeConversation.id);
      }

      toast.success("Reconnected to chat server");
    });

    socket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });

    socket.on("reconnect_failed", () => {
      console.error("Failed to reconnect to server");
      toast.error("Failed to reconnect to chat server");
    });

    // Join conversation room when active conversation changes
    if (activeConversation?.id) {
      console.log("Joining conversation room:", activeConversation.id);
      socket.emit("join_conversation", activeConversation.id);
    }

    // Message event handlers - using the correct event name from backend
    socket.on("receive_message", (messageData) => {
      console.log("Received new message:", messageData);

      // Extract the actual message from messageData
      const newMessage = messageData.message || messageData;

      // Only add message if it belongs to the current conversation
      if (newMessage.conversationId === activeConversation?.id) {
        setAllMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg.id === newMessage.id
          );
          if (messageExists) return prevMessages;

          const updatedMessages = [...prevMessages, newMessage];

          // Scroll to bottom for new messages
          scrollToBottom();

          return updatedMessages;
        });
      }

      // Always update conversations list for any new message
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Show notification if message is from someone else
      const messageSenderId =
        newMessage.sender?.clinicianProfile?.userId ||
        newMessage.sender?.patientProfile?.userId ||
        newMessage.sender?.id;

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

    // Typing indicators - matching backend event structure
    socket.on("user_typing", ({ userId, conversationId, isTyping }) => {
      console.log("User typing:", { userId, conversationId, isTyping });
      if (conversationId === activeConversation?.id && userId !== userInfo.id) {
        if (isTyping) {
          setTypingUsers((prev) => new Set(prev.add(userId)));
        } else {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        }
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error("Chat error occurred");
    });

    // Cleanup on unmount
    return () => {
      if (activeConversation?.id) {
        socket.emit("leave_conversation", activeConversation.id);
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [
    userInfo?.id,
    activeConversation?.id,
    currentUserRole,
    currentUserId,
    queryClient,
    scrollToBottom,
  ]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socketRef.current || !activeConversation?.id || !socketConnected)
      return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", {
        conversationId: activeConversation.id,
        userId: userInfo.id,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && activeConversation?.id && socketConnected) {
        setIsTyping(false);
        socketRef.current.emit("typing", {
          conversationId: activeConversation.id,
          userId: userInfo.id,
          isTyping: false,
        });
      }
    }, 3000);
  }, [isTyping, activeConversation?.id, userInfo.id, socketConnected]);

  // Reset messages and page when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      // Leave previous conversation if socket is connected
      if (socketRef.current && socketConnected) {
        // Leave any previous conversation rooms
        socketRef.current.emit("leave_conversation", activeConversation.id);
        // Join new conversation room
        socketRef.current.emit("join_conversation", activeConversation.id);
      }

      setCurrentPage(1);
      setAllMessages([]);
      setTypingUsers(new Set());
      setHasInitialized(false);
      lastMessageCountRef.current = 0;

      if (refetchMessages) {
        refetchMessages();
      }
    }
  }, [activeConversation?.id, refetchMessages, userInfo.id, socketConnected]);

  // Handle messages data and scroll to bottom on initial load
  useEffect(() => {
    if (!messagesData?.messages) return;

    const newMessages = messagesData.messages;

    if (currentPage === 1) {
      // For first page, replace all messages
      setAllMessages(newMessages);

      // Scroll to bottom on first load or when new messages arrive
      if (
        !hasInitialized ||
        newMessages.length !== lastMessageCountRef.current
      ) {
        setHasInitialized(true);
        lastMessageCountRef.current = newMessages.length;
        scrollToBottom("auto"); // Use auto for initial load to be immediate
      }
    } else {
      // For pagination, prepend messages
      setAllMessages((prev) => [...newMessages, ...prev]);
    }

    setIsLoadingMore(false);
  }, [messagesData, currentPage, hasInitialized, scrollToBottom]);

  const sendMessageMutation = useSendMessage(activeConversation);

  // Handle successful message send
  useEffect(() => {
    if (sendMessageMutation.isSuccess && sendMessageMutation.data) {
      const newMessage = sendMessageMutation.data.data;

      // If socket is connected, emit the message to other users
      if (socketRef.current && activeConversation?.id && socketConnected) {
        console.log("Emittieng new mssage via socket:", newMessage);
        socketRef.current.emit("send_message", {
          conversationId: activeConversation.id,
          message: newMessage,
        });
      }

      // Add message to local state (this will show the message immediately for sender)
      setAllMessages((prev) => {
        const messageExists = prev.some((msg) => msg.id === newMessage.id);
        if (messageExists) return prev;

        const updatedMessages = [...prev, newMessage];

        // Scroll to bottom when sending a message
        scrollToBottom();

        return updatedMessages;
      });

      if (currentPage !== 1) {
        setCurrentPage(1);
      }

      // Stop typing indicator
      if (socketRef.current && activeConversation?.id && socketConnected) {
        setIsTyping(false);
        socketRef.current.emit("typing", {
          conversationId: activeConversation.id,
          userId: userInfo.id,
          isTyping: false,
        });
      }
    }
  }, [
    sendMessageMutation.isSuccess,
    sendMessageMutation.data,
    currentPage,
    activeConversation?.id,
    userInfo.id,
    socketConnected,
    scrollToBottom,
  ]);

  // Sort messages by creation time
  const sortedMessages = [...allMessages].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Handle scroll to load more messages
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      // Load more messages when near the top
      if (scrollTop < 100 && !isLoadingMore && messagesData?.pagination) {
        const { page, pages } = messagesData.pagination;

        if (page < pages) {
          setIsLoadingMore(true);
          const currentScrollHeight = scrollHeight;

          setCurrentPage((prev) => prev + 1);

          // Maintain scroll position after loading more messages
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const newScrollHeight = messagesContainerRef.current.scrollHeight;
              const scrollDiff = newScrollHeight - currentScrollHeight;
              messagesContainerRef.current.scrollTop = scrollTop + scrollDiff;
            }
          }, 100);
        }
      }
    },
    [isLoadingMore, messagesData?.pagination]
  );

  const handleSendMessage = async () => {
    if (
      !activeConversation?.id ||
      (!message.trim() && attachments.length === 0)
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("conversationId", activeConversation.id.toString());
    formData.append("content", message);

    attachments.forEach((attachment) => {
      formData.append("attachments", attachment.file);
    });

    try {
      await sendMessageMutation.mutateAsync(formData);
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      const newAttachments = Array.from(filesList).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
    e.target.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      const newAttachments = Array.from(filesList).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(attachments[index].previewUrl);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Check if a user is online
  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  // Get typing indicator text
  const getTypingIndicator = () => {
    if (typingUsers.size === 0) return null;

    const typingArray = Array.from(typingUsers);
    if (typingArray.length === 1) {
      return "Someone is typing...";
    } else {
      return `${typingArray.length} people are typing...`;
    }
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        URL.revokeObjectURL(attachment.previewUrl);
      });
    };
  }, [attachments]);

  return isLoading ? (
    <p className="flex items-center justify-center h-96">
      <Loader color="#000000" />
    </p>
  ) : error ? (
    <p className="h-20 text-center">Something went wrong.</p>
  ) : conversations?.length < 1 ? (
    <p className="flex items-center justify-center h-40">No message found.</p>
  ) : (
    <div className="mb-20 sm:p-4 p-1 md:p-6">
      <div className="flex items-center justify-between">
        <p className="text-textPrimary font-nerisSemiBold text-[28px] md:text-[32px] mt-3 sm:mt-0 mb-3 md:mb-10">
          Message
        </p>

        {/* Connection Status Indicator */}
        {/* <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
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
          {socketConnected ? "Connected" : "Disconnected"}
        </div> */}
      </div>

      <div className="flex flex-col 2xl:flex-row gap-5 lg:gap-10 bg-white sm:p-4 p-2 2xl:p-8 rounded-2xl ">
        {/* Chat List */}
        <div className="hidden 2xl:block w-full 2xl:w-5/12 3xl:w-4/12 4xl:w-3/12 mt-2 md:mt-4 h-[500px] overflow-y-auto">
          {/* <div className="flex gap-2 items-center border border-[#5A5C5F] rounded-2xl px-4 py-3">
            <SearchSvg />
            <input
              className="text-[#BABABA] w-full focus:outline-none"
              type="search"
              placeholder="Search"
              onChange={() => {}}
            />
          </div> */}

          {conversations?.map((user: any) => {
            const lastMessageTimeAgo = getTimeAgo(user?.lastMessageAt);
            const userId = user?.patient?.id || user?.clinician?.id;
            const online = isUserOnline(userId);
            console.log("uuuuuuser", user);
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between mt-5 py-4 md:py-6 rounded-2xl cursor-pointer px-2 w-full ${
                  activeConversation?.id === user?.id
                    ? "bg-[#F2F8FF]"
                    : "bg-white"
                }`}
                onClick={() => {
                  // Add conversation selection logic if needed
                  setActiveConversation(user);
                }}
              >
                <div className="flex gap-2 items-center w-full">
                  <div className="relative">
                    <img
                      className="w-[44px] h-[44px] object-cover rounded-full"
                      src={
                        user?.patient?.patientProfile?.avatar ||
                        user?.clinician?.clinicianProfile?.avatar ||
                        imageProvider.defaultImg
                      }
                      alt={user?.name}
                    />
                    {online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-textPrimary font-nerisSemiBold">
                          {user.patient?.patientProfile?.firstName ||
                            user?.clinician?.clinicianProfile?.firstName}{" "}
                          {user.patient?.patientProfile?.lastName ||
                            user.clinician?.clinicianProfile?.lastName}
                        </p>
                        {online && (
                          <span className="text-green-500 text-xs">
                            ● Online
                          </span>
                        )}
                      </div>
                      <p className="text-textSecondary font-Poppins font-light text-sm mt-1 truncate max-w-[120px]">
                        {user.lastMessage}
                      </p>
                    </div>
                    <p className="textsm text-textSecondary">
                      {lastMessageTimeAgo}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-textSecondary font-Poppins font-light text-sm mb-1">
                    {user.time}
                  </p>
                  {user?.star === true && <StarSvg />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Window - Desktop */}
        <div className="hidden w-full 2xl:w-8/12 3xl:w-8/12 4xl:w-9/12 bg-[#F2F8FF] rounded-2xl p-4 md:p-6 2xl:flex flex-col justify-between mt-4 md:mt-0">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 rounded-xl mb-5">
              <RightArraySvg />
              <div className="relative">
                <img
                  className="w-[40px] h-[40px] object-cover rounded-full"
                  src={
                    activeConversation?.patient?.patientProfile?.avatar ||
                    activeConversation?.clinician?.clinicianProfile?.avatar ||
                    imageProvider.defaultImg
                  }
                  alt={activeConversation?.patient?.patientProfile?.firstName}
                />
                {isUserOnline(
                  activeConversation?.patient?.id ||
                    activeConversation?.clinician?.id
                ) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <p className="text-textPrimary font-nerisSemiBold">
                  {activeConversation?.patient?.patientProfile?.firstName ||
                    activeConversation?.clinician?.clinicianProfile
                      ?.firstName}{" "}
                  {activeConversation?.patient?.patientProfile?.lastName ||
                    activeConversation?.clinician?.clinicianProfile?.lastName}
                </p>
                {/* <p className="text-textSecondary font-Poppins font-light text-sm mt-1">
                  {isUserOnline(
                    activeConversation?.patient?.id ||
                      activeConversation?.clinician?.id
                  )
                    ? "Online"
                    : "Offline"}
                </p> */}
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar"
              style={{ maxHeight: "50vh", minHeight: "40vh" }}
              ref={messagesContainerRef}
              onScroll={handleScroll}
            >
              {isLoadingMore && (
                <div className="flex justify-center py-2">
                  <Loader size={4} color="#000000" />
                </div>
              )}
              {sortedMessages?.map((msg: Message, index: number) => {
                const isCurrentUser = msg?.sender?.role === currentUserRole;
                const profile =
                  msg.sender?.clinicianProfile || msg.sender?.patientProfile;

                return (
                  <div
                    key={`${msg.id}-${index}`}
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
                      <p className="font-Poppins font-light">{msg?.content}</p>
                      {msg?.attachments?.length > 0 && (
                        <div className="mt-2">
                          {msg?.attachments?.map(
                            (attachment: any, i: number) => {
                              console.log("atta", attachment);
                              return (
                                <div key={i} className="mb-2">
                                  {attachment && (
                                    <>
                                      {/\.(pdf|docx?|pptx?|xlsx?)$/i.test(
                                        attachment
                                      ) ? (
                                        <>
                                          <iframe
                                            src={attachment}
                                            className="w-full h-40 rounded-md"
                                          ></iframe>
                                          <a
                                            href={attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                          >
                                            {/* attachment.split("/").pop() || */}
                                            {"Download file"}
                                          </a>
                                        </>
                                      ) : (
                                        <img
                                          src={attachment || imageProvider?.pdf}
                                          alt="attachment"
                                          className="max-w-full max-h-40 rounded-md"
                                        />
                                      )}
                                    </>
                                  )}

                                  {/* {attachment.type?.startsWith("image/") ? (
                                    <img
                                      src={attachment}
                                      alt="attachment"
                                      className="max-w-full max-h-40 rounded-md"
                                    />
                                  ) : (
                                    <a
                                      href={attachment}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 underline"
                                    >
                                      {attachment?.name || "Download file"}
                                    </a>
                                  )} */}
                                </div>
                              );
                            }
                          )}
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
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {getTypingIndicator() && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 animate-pulse">
                    <div className="flex items-center gap-1">
                      {getTypingIndicator()}
                      <div className="flex gap-1 ml-2">
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-3 mt-5 relative w-full flex-wrap"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <label className="cursor-pointer">
              <CameraSvg />
              <input
                type="file"
                multiple
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraChange}
              />
            </label>

            <label className="cursor-pointer">
              <LinkSvg />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <label className="text-textSecondary border border-[#5A5C5F] bg-white py-2 px-4 rounded-2xl relative flex-1 min-w-[200px]">
              {attachments.length > 0 && (
                <div className="flex gap-3 overflow-x-auto mb-2 max-w-full">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-[60px] h-[60px] rounded overflow-hidden border border-gray-300"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile(index);
                        }}
                        className="absolute top-0 right-0 bg-[#F2F8FF] text-red-700 rounded-bl px-1 text-xs"
                      >
                        <CloseOutlined />
                      </button>
                      {attachment.type === "image" ? (
                        <img
                          src={attachment.previewUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs px-1 text-gray-600 break-words">
                          {attachment.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="Write your message"
                className="focus:outline-none w-full"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
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
            </label>

            <button
              type="submit"
              className="cursor-pointer -ml-1"
              disabled={sendMessageMutation.isPending}
            >
              {sendMessageMutation?.isPending ? (
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
        </div>

        {/* Mobile View */}
        {showIcon ? (
          <div className="bg-[#F2F8FF] flex 2xl:hidden w-full rounded-2xl p-4 md:p-6 flex-col justify-between mt-4 md:mt-0">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 rounded-xl mb-5">
                <div onClick={() => setShowIcon(false)}>
                  <RightArraySvg />
                </div>
                <div className="relative">
                  <img
                    className="w-[40px] h-[40px] object-cover rounded-full"
                    src={
                      activeConversation?.patient?.patientProfile?.avatar ||
                      imageProvider.defaultImg ||
                      activeConversation?.clinician?.clinicianProfile?.avatar
                    }
                    alt={activeConversation?.patient?.patientProfile?.firstName}
                  />
                  {isUserOnline(
                    activeConversation?.patient?.id ||
                      activeConversation?.clinician?.id
                  ) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="text-textPrimary font-nerisSemiBold">
                    {activeConversation?.patient?.patientProfile?.firstName ||
                      activeConversation?.clinician?.clinicianProfile
                        ?.firstName}{" "}
                    {activeConversation?.patient?.patientProfile?.lastName ||
                      activeConversation?.clinician?.clinicianProfile?.lastName}
                  </p>
                  {/* <p className="text-textSecondary font-Poppins font-light text-sm mt-1">
                    {isUserOnline(
                      activeConversation?.patient?.id ||
                        activeConversation?.clinician?.id
                    )
                      ? "Online"
                      : "Offline"}
                  </p> */}
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar"
                style={{ maxHeight: "50vh", minHeight: "40vh" }}
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
                {isLoadingMore && (
                  <div className="flex justify-center py-2">
                    <Loader size={4} color="#000000" />
                  </div>
                )}
                {sortedMessages?.map((msg: Message, index: number) => {
                  const isCurrentUser = msg?.sender?.role === currentUserRole;
                  const profile =
                    msg.sender?.clinicianProfile || msg.sender?.patientProfile;

                  return (
                    <div
                      key={`mobile-${msg.id}-${index}`}
                      className={`flex gap-2 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isCurrentUser && profile?.avatar && (
                        <div className="flex items-end">
                          <img
                            className="w-[36px] h-[36px] object-cover rounded-full"
                            src={profile.avatar}
                            alt={`${profile.firstName} ${profile.lastName}`}
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
                        <p className="font-Poppins font-light">{msg.content}</p>
                        {msg?.attachments?.length > 0 && (
                          <div className="mt-2">
                            {msg?.attachments?.map(
                              (attachment: any, i: number) => (
                                <div key={i} className="mb-2">
                                  <img
                                    src={attachment || imageProvider?.pdf}
                                    alt="attachment"
                                    className="max-w-full max-h-40 rounded-md"
                                  />
                                  {/* {attachment.type?.startsWith("image/") ? (
                                    <img
                                      src={attachment.url}
                                      alt="attachment"
                                      className="max-w-full max-h-40 rounded-md"
                                    />
                                  ) : (
                                    <a
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 underline"
                                    >
                                      {attachment.name || "Download file"}
                                    </a>
                                  )} */}
                                </div>
                              )
                            )}
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
                            className="w-[36px] h-[36px] object-cover rounded-full"
                            src={profile.avatar}
                            alt="You"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Mobile Typing indicator */}
                {getTypingIndicator() && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 animate-pulse">
                      <div className="flex items-center gap-1">
                        {getTypingIndicator()}
                        <div className="flex gap-1 ml-2">
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Mobile Input */}
            <form
              className="flex items-center gap-3 mt-5 relative w-full flex-wrap"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <label className="cursor-pointer">
                <CameraSvg />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleCameraChange}
                />
              </label>

              <label className="cursor-pointer">
                <LinkSvg />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <label className="text-textSecondary border border-[#5A5C5F] bg-white py-2 px-4 rounded-2xl relative flex-1 min-w-[150px]">
                {attachments.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto mb-2 max-w-full">
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="relative flex-shrink-0 w-[60px] h-[60px] rounded overflow-hidden border border-gray-300"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile(index);
                          }}
                          className="absolute top-0 right-0 bg-[#F2F8FF] text-red-700 rounded-bl px-1 text-xs"
                        >
                          <CloseOutlined />
                        </button>
                        {attachment.type === "image" ? (
                          <img
                            src={attachment.previewUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xs px-1 text-gray-600 break-words">
                            {attachment.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Write your message"
                  className="focus:outline-none w-full placeholder:text-xs"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
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
              </label>

              <button
                type="submit"
                className="cursor-pointer -ml-1"
                disabled={sendMessageMutation.isPending}
              >
                {sendMessageMutation?.isPending ? (
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
          </div>
        ) : (
          <div className="2xl:hidden block w-full 2xl:w-5/12 3xl:w-4/12 4xl:w-3/12 mt-2 md:mt-4">
            {/* <div className="flex gap-2 items-center border border-[#5A5C5F] rounded-2xl px-4 py-3">
              <SearchSvg />
              <input
                className="text-[#BABABA] w-full focus:outline-none"
                type="search"
                placeholder="Search"
              />
            </div> */}

            {conversations?.map((user: any) => {
              const lastMessageTimeAgo = getTimeAgo(user?.lastMessageAt);
              const userId = user?.patient?.id || user?.clinician?.id;
              const online = isUserOnline(userId);

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between mt-5 p-4 md:p-6 rounded-2xl cursor-pointer ${
                    activeConversation?.id === user.id
                      ? "bg-[#F2F8FF]"
                      : "bg-white"
                  }`}
                  onClick={() => {
                    setShowIcon(true);
                    setActiveConversation(user);
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <img
                        className="w-[44px] h-[44px] object-cover rounded-full"
                        src={
                          user?.patient?.patientProfile?.avatar ||
                          imageProvider.defaultImg ||
                          user?.clinician?.clinicianProfile?.avatar
                        }
                        alt={user?.patient?.patientProfile?.firstName}
                      />
                      {online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-textPrimary font-nerisSemiBold">
                          {user?.patient?.patientProfile?.firstName ||
                            user?.clinician?.clinicianProfile?.firstName}{" "}
                          {user?.patient?.patientProfile?.lastName ||
                            user?.clinician?.clinicianProfile?.lastName}
                        </p>
                        {online && (
                          <span className="text-green-500 text-xs">
                            ● Online
                          </span>
                        )}
                      </div>
                      <p className="text-textSecondary font-Poppins font-light text-sm mt-1 truncate max-w-[120px]">
                        {user.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-textSecondary font-Poppins font-light text-sm mb-1">
                      {lastMessageTimeAgo}
                    </p>
                    {user.star === true && <StarSvg />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
