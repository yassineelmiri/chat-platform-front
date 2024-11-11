import { useQuery } from "@tanstack/react-query";
import useCurrentChat from "../../../hooks/useCurrentChat";
import { Chat } from "../../../types/chat";
import axiosInstance from "../../../utils/axiosInstance";


const fetchChat = async (chatId: string): Promise<Chat> => {
    const response = await axiosInstance.get<Chat>(`/chats/${chatId}`);
    return response.data;
};

const useChatBody = () => {
  const { isOpen, chatId } = useCurrentChat();
  const { data: chat, isLoading, error } = useQuery<Chat, Error>({
    queryKey: ['chats', chatId],
    queryFn: () => fetchChat(chatId),
    staleTime: 1000 * 60 * 5,
});

  return { isOpen, chatId, chat, isLoading, error };
};

export default useChatBody;
