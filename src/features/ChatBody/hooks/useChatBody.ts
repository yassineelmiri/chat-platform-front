import { useQuery } from "@tanstack/react-query";
import useCurrentChat from "../../../hooks/useCurrentChat";
import axiosInstance from "../../../utils/axiosInstance";
import { ChatData } from "../../../types/message";


const fetchMessages = async (chatId: string): Promise<ChatData> => {
  const response = await axiosInstance.get<ChatData>(`/messages/${chatId}`);
  return response.data;
};

const useChatBody = () => {
  const { isOpen, chatId } = useCurrentChat();
  const { data, isLoading, error } = useQuery<ChatData, Error>({
    queryKey: ['chats', chatId],
    queryFn: () => fetchMessages(chatId),
    staleTime: 1000 * 60 * 5,
  });

  return { isOpen, chatId, data, isLoading, error };
};

export default useChatBody;
