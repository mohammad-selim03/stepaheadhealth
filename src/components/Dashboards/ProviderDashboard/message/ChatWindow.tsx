import React, { useRef } from "react";
import { MessageItem } from "./MessageItem";
import { MessageInput } from "./MessageInput";
import { RightArraySvg } from "../../../../assets/svgContainer";
import { imageProvider } from "../../../../lib/imageProvider";
import Loader from "../../../common/Loader";
import type Message from "./Message";
import { TypingIndicator } from "./TypingIndecator";

interface MessageWindowProps {
  activeConversation: any;
  sortedMessages: Message[];
  currentUserRole: string;
  currentUserId: string;
  onlineUsers: Set<string>;
  isLoadingMore: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  typingUsers: Set<string>;
  message: string;
  setMessage: (message: string) => void;
  attachments: any[];
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "file"
  ) => void;
  removeFile: (index: number) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleEmojiClick: (emojiData: any) => void;
  handleSendMessage: () => void;
  handleTyping: () => void;
  isPending: boolean;
  setShowIcon?: (show: boolean) => void;
  isMobile?: boolean;
}

export const MessageWindow: React.FC<MessageWindowProps> = ({
  activeConversation,
  sortedMessages,
  currentUserRole,
  currentUserId,
  onlineUsers,
  isLoadingMore,
  messagesContainerRef,
  handleScroll,
  typingUsers,
  message,
  setMessage,
  attachments,
  handleFileChange,
  removeFile,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  handleSendMessage,
  handleTyping,
  isPending,
  setShowIcon,
  isMobile = false,
}) => {
  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  const messagesEndRef = useRef();

  return (
    <div
      className={`${
        isMobile ? "flex 2xl:hidden" : "hidden 2xl:flex"
      } w-full bg-[#F2F8FF] rounded-2xl p-4 md:p-6 flex-col justify-between mt-4 md:mt-0`}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 rounded-xl mb-5">
          {isMobile && setShowIcon && (
            <div onClick={() => setShowIcon(false)}>
              <RightArraySvg />
            </div>
          )}
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
                activeConversation?.clinician?.clinicianProfile?.firstName}{" "}
              {activeConversation?.patient?.patientProfile?.lastName ||
                activeConversation?.clinician?.clinicianProfile?.lastName}
            </p>
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
            return (
              <MessageItem
                key={`${isMobile ? "mobile-" : ""}${msg.id}-${index}`}
                msg={msg}
                isCurrentUser={isCurrentUser}
                currentUserRole={currentUserRole}
              />
            );
          })}

          <TypingIndicator typingUsers={typingUsers} />

          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        attachments={attachments}
        handleFileChange={handleFileChange}
        removeFile={removeFile}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiClick={handleEmojiClick}
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
        isPending={isPending}
        isMobile={isMobile}
      />
    </div>
  );
};
