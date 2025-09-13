import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useSendMessage = (activeConversation?: { id: string | number }) => {
  const queryClient = useQueryClient();
  const token = JSON.parse(localStorage.getItem("token") || "null");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  
  return useMutation({
    mutationKey: ["send-message"],
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/message`,
        formData,
        {
          headers: {
            // Remove Content-Type - let axios handle it for FormData
            Authorization: token ? `Bearer ${token || userInfo?.token}` : "",
          },
        }
      );
      return res.data;
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to send message");
    },
    onSuccess: () => {
      // Just invalidate queries - let the component handle state updates
      queryClient.invalidateQueries({
        queryKey: ["messages-list", activeConversation?.id],
      });
    },
  });
};