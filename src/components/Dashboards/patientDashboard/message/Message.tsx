import {
  CameraSvg,
  LinkSvg,
  RightArraySvg, 
  SendSvg,
  StarSvg,
} from "../../../../assets/svgContainer";
import { imageProvider } from "../../../../lib/imageProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API"; 
import { useSendMessage } from "./useSendMessage";
import Loader from "../../../common/Loader";

// ... (keep your existing chatList and getTimeAgo function)
export /**
 * Converts a timestamp into a "time ago" string (e.g., "5 min ago").
 * @param {string} timestamp - ISO timestamp (e.g., "2025-08-12T05:40:20.060Z")
 * @returns {string} Human-readable time difference (e.g., "8 min ago")
 */
function getTimeAgo(timestamp) {
  if (!timestamp) return "Just now";

  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000); // Difference in seconds

  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) return "Just now"; // Less than 1 minute

  // Find the largest unit that fits
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"}`;
    }
  }

  return "Just now";
}

const PatientMessage = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [showIcon, setShowIcon] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const currentUserRole = userInfo?.role;

  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => GetData(`chat/user`),
  });

  const activeConversation = conversations?.[0];

  // Modified messages query to include pagination
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messageError,
  } = useQuery({
    queryKey: ["messages-list", activeConversation?.id, currentPage],
    queryFn: () =>
      GetData(
        `chat/${activeConversation?.id}/messages?page=${currentPage}&limit=20`
      ),
    enabled: !!activeConversation?.id,
    onSuccess: (data) => {
      if (currentPage === 1) {
        // First page - replace all messages
        setAllMessages(data?.data?.messages || []);
      } else {
        // Additional pages - prepend to existing messages
        setAllMessages((prev) => [...(data?.data?.messages || []), ...prev]);
      }
      setIsLoadingMore(false);
    },
  });

  const sendMessageMutation = useSendMessage(activeConversation);

  // Reset messages when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      setCurrentPage(1);
      setAllMessages([]);
    }
  }, [activeConversation?.id]);

  // Scroll to bottom for new messages (fixed to use allMessages)
  useEffect(() => {
    if (currentPage === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, currentPage]);

  // Handle successful message send
  useEffect(() => {
    if (sendMessageMutation.isSuccess && sendMessageMutation.data) {
      // Add new message to the end of current messages
      setAllMessages((prev) => [...prev, sendMessageMutation.data.data]);
      // Reset to first page to ensure we're showing latest
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }
  }, [sendMessageMutation.isSuccess, sendMessageMutation.data]);

  // Fixed to use allMessages instead of messages
  const sortedMessages = [...allMessages].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Handle scroll to load more messages
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      // Check if scrolled to top (with small threshold)
      if (scrollTop < 100 && !isLoadingMore && messagesData?.data?.pagination) {
        const { page, pages } = messagesData.data.pagination;

        // Load next page if available
        if (page < pages) {
          setIsLoadingMore(true);
          setCurrentPage((prev) => prev + 1);

          // Store current scroll position to maintain scroll after loading
          const scrollFromBottom = scrollHeight - scrollTop;

          // Restore scroll position after messages load
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const newScrollTop =
                messagesContainerRef.current.scrollHeight - scrollFromBottom;
              messagesContainerRef.current.scrollTop = newScrollTop;
            }
          }, 100);
        }
      }
    },
    [isLoadingMore, messagesData?.data?.pagination]
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
    <p className="h-20 text-center">Someting went wrong.</p>
  ) : conversations?.length < 1 ? (
    <p className="flex items-center justify-center h-40">No message found.</p>
  ) : (
    <div className="mb-20 sm:p-4 p-1 md:p-6">
      <p className="text-textPrimary font-nerisSemiBold text-[28px] md:text-[32px] mt-3 sm:mt-0 mb-3 md:mb-10">
        Message
      </p>

      <div className="flex flex-col 2xl:flex-row gap-5 lg:gap-10 bg-white sm:p-4 p-2 2xl:p-8 rounded-2xl">
        {/* Chat List */}
        <div className="hidden 2xl:block w-full 2xl:w-5/12 3xl:w-4/12 4xl:w-3/12 mt-2 md:mt-4">
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
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between mt-5 py-4 md:py-6 rounded-2xl cursor-pointer px-2 w-full ${
                  activeConversation?.id === user.id
                    ? "bg-[#F2F8FF]"
                    : "bg-white"
                }`}
                onClick={() => {
                  // Add conversation selection logic if needed
                }}
              >
                <div className="flex gap-2 items-center w-full">
                  <img
                    className="w-[44px] h-[44px] object-cover rounded-full"
                    src={
                      user?.patient?.patientProfile?.avatar ||
                      imageProvider.defaultImg
                    }
                    alt={user?.name}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-textPrimary font-nerisSemiBold">
                        {user.patient?.patientProfile?.firstName}{" "}
                        {user.patient?.patientProfile?.lastName}
                      </p>
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
                  {user.star === true && <StarSvg />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Window */}
        <div className="hidden w-full 2xl:w-8/12 3xl:w-8/12 4xl:w-9/12 bg-[#F2F8FF] rounded-2xl p-4 md:p-6 2xl:flex flex-col justify-between mt-4 md:mt-0">
          <div>
            <div className="flex items-center gap-2 rounded-xl mb-5">
              <RightArraySvg />
              <img
                className="w-[40px] h-[40px] object-cover rounded-full"
                src={
                  activeConversation?.patient?.patientProfile?.avatar ||
                  imageProvider.defaultImg
                }
                alt={activeConversation?.patient?.patientProfile?.firstName}
              />
              <div>
                <p className="text-textPrimary font-nerisSemiBold">
                  {activeConversation?.patient?.patientProfile?.firstName}{" "}
                  {activeConversation?.patient?.patientProfile?.lastName}
                </p>
                <p className="text-textSecondary font-Poppins font-light text-sm mt-1">
                  {/* Active status can be added here */}
                </p>
              </div>
            </div>

            <div
              className="overflow-y-auto pr-2 max-h-[48vh] space-y-4 hide-scrollbar"
              ref={messagesContainerRef}
              onScroll={handleScroll}
            >
              {isLoadingMore && (
                <div className="flex justify-center py-2">
                  <Loader size={4} color="#000000" />
                </div>
              )}
              {sortedMessages?.map((msg: any, index: number) => {
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
                      <p className="font-Poppins font-light">{msg.content}</p>
                      {msg.attachments?.length > 0 && (
                        <div className="mt-2">
                          {msg.attachments.map((attachment: any, i: number) => (
                            <div key={i} className="mb-2">
                              {attachment.type?.startsWith("image/") ? (
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
                        />
                      </div>
                    )}
                  </div>
                );
              })}
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
                onChange={(e) => setMessage(e.target.value)}
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
            <div>
              <div className="flex items-center gap-2 rounded-xl mb-5">
                <div onClick={() => setShowIcon(false)}>
                  <RightArraySvg />
                </div>
                <img
                  className="w-[40px] h-[40px] object-cover rounded-full"
                  src={
                    activeConversation?.patient?.patientProfile?.avatar ||
                    imageProvider.defaultImg
                  }
                  alt={activeConversation?.patient?.patientProfile?.firstName}
                />
                <div>
                  <p className="text-textPrimary font-nerisSemiBold">
                    {activeConversation?.patient?.patientProfile?.firstName}{" "}
                    {activeConversation?.patient?.patientProfile?.lastName}
                  </p>
                  <p className="text-textSecondary font-Poppins font-light text-sm mt-1">
                    {/* Active status */}
                  </p>
                </div>
              </div>

              <div className="overflow-y-auto pr-2 max-h-[48vh] space-y-4 hide-scrollbar">
                {sortedMessages?.map((msg, index) => {
                  const isCurrentUser = msg?.sender?.role === currentUserRole;
                  const profile =
                    msg.sender?.clinicianProfile || msg.sender?.patientProfile;

                  return (
                    <div
                      key={index}
                      className={`flex items-end gap-3 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isCurrentUser && profile?.avatar && (
                        <img
                          className="w-[36px] h-[36px] object-cover rounded-full"
                          src={profile.avatar}
                          alt={`${profile.firstName} ${profile.lastName}`}
                        />
                      )}
                      <div
                        className={`rounded-xl px-4 py-2 max-w-[90%] text-sm md:text-base ${
                          isCurrentUser
                            ? "bg-primaryColor text-white"
                            : "bg-white text-textPrimary"
                        }`}
                      >
                        <p className="font-Poppins font-light">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser ? "text-white" : "text-textPrimary"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {isCurrentUser && profile?.avatar && (
                        <img
                          className="w-[36px] h-[36px] object-cover rounded-full"
                          src={profile.avatar}
                          alt="You"
                        />
                      )}
                    </div>
                  );
                })}
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
                  onChange={(e) => setMessage(e.target.value)}
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
              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between mt-5 p-4 md:p-6 rounded-2xl cursor-pointer ${
                    activeConversation?.id === user.id
                      ? "bg-[#F2F8FF]"
                      : "bg-white"
                  }`}
                  onClick={() => setShowIcon(true)}
                >
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-[44px] h-[44px] object-cover rounded-full"
                      src={
                        user?.patient?.patientProfile?.avatar ||
                        imageProvider.defaultImg
                      }
                      alt={user?.patient?.patientProfile?.firstName}
                    />
                    <div>
                      <p className="text-textPrimary font-nerisSemiBold">
                        {user?.patient?.patientProfile?.firstName}{" "}
                        {user?.patient?.patientProfile?.lastName}
                      </p>
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

export default PatientMessage;
