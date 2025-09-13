import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface SendMessageParams {
  conversationId: string;
  content: string;
  attachments?: File[];
}

export const useSendMessage = (activeConversation: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Patient-specific endpoint for sending messages using raw axios
      const token = localStorage.getItem("token");
      return axios.post(`${process.env.REACT_APP_API_URL || '/api'}/chat/patient/send-message`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch conversations to update last message
      queryClient.invalidateQueries({
        queryKey: ["patient-conversations"],
      });

      // Invalidate messages for the current conversation
      if (activeConversation?.id) {
        queryClient.invalidateQueries({
          queryKey: ["patient-messages-list", activeConversation.id],
        });
      }

      toast.success("Message sent successfully!");
    },
    onError: (error: any) => {
      console.error("Error sending message:", error);
      toast.error(
        error?.response?.data?.message || 
        "Failed to send message. Please try again."
      );
    },
  });
};