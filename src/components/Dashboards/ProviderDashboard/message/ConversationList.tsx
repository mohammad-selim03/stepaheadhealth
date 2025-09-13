import React from 'react';
import { StarSvg } from "../../../../assets/svgContainer";
import { imageProvider } from "../../../../lib/imageProvider";

interface ConversationListProps {
  conversations: any[];
  activeConversation: any;
  setActiveConversation: (conversation: any) => void;
  setShowIcon?: (show: boolean) => void;
  isUserOnline: (userId: string) => boolean;
  getTimeAgo: (timestamp: string) => string;
  isMobile?: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  setActiveConversation,
  setShowIcon,
  isUserOnline,
  getTimeAgo,
  isMobile = false
}) => {
  const handleConversationClick = (user: any) => {
    setActiveConversation(user);
    if (isMobile && setShowIcon) {
      setShowIcon(true);
    }
  };

  return (
    <div className={`w-full ${!isMobile ? '2xl:w-5/12 3xl:w-4/12 4xl:w-3/12 hidden 2xl:block' : '2xl:hidden block'} mt-2 md:mt-4 ${!isMobile ? 'h-[500px] overflow-y-auto' : ''}`}>
      {conversations?.map((user: any) => {
        const lastMessageTimeAgo = getTimeAgo(user?.lastMessageAt);
        const userId = user?.patient?.id || user?.clinician?.id;
        const online = isUserOnline(userId);

        return (
          <div
            key={user.id}
            className={`flex items-center justify-between mt-5 ${!isMobile ? 'py-4 md:py-6 px-2' : 'p-4 md:p-6'} rounded-2xl cursor-pointer w-full ${
              activeConversation?.id === user?.id
                ? "bg-[#F2F8FF]"
                : "bg-white"
            }`}
            onClick={() => handleConversationClick(user)}
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

export default ConversationList;