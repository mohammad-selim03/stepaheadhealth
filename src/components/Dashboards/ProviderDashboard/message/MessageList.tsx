import React from "react";  
import { imageProvider } from "../../../../lib/imageProvider";
import type { Conversation } from "./messageTypes";
import { getTimeAgo } from "../../../../lib/timeUtils";

interface MessageListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
  onlineUsers: Set<string>;
  setShowIcon: (show: boolean) => void;
  isMobile?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  conversations,
  activeConversation,
  setActiveConversation,
  onlineUsers,
  setShowIcon,
  isMobile = false
}) => {
  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return (
    <div className={`${isMobile ? "block 2xl:hidden" : "hidden 2xl:block"} w-full 2xl:w-5/12 3xl:w-4/12 4xl:w-3/12 mt-2 md:mt-4 h-[500px] overflow-y-auto`}>
      {conversations?.map((user: any) => {
        const lastMessageTimeAgo = getTimeAgo(user?.lastMessageAt);
        const userId = user?.patient?.id || user?.clinician?.id;
        const online = isUserOnline(userId);

        return (
          <div
            key={user.id}
            className={`flex items-center justify-between mt-5 py-4 md:py-6 rounded-2xl cursor-pointer px-2 w-full ${
              activeConversation?.id === user?.id
                ? "bg-[#F2F8FF]"
                : "bg-white"
            }`}
            onClick={() => {
              setActiveConversation(user);
              if (isMobile) setShowIcon(true);
            }}
          >
            <div className="flex gap-2 items-center w-full">
              <div className="relative">
                <img
                  className="w-[44px] h-[44px] object-cover rounded-full"
                  src={
                    user?.patient?.patientProfile?.avatar ||
                    imageProvider.defaultImg ||
                    user?.clinician?.clinicianProfile?.avatar
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
  );
};