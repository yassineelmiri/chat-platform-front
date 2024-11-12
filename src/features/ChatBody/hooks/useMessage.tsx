import { useQuery } from "@tanstack/react-query";
import useCurrentChat from "../../../hooks/useCurrentChat";
import axiosInstance from "../../../utils/axiosInstance";
import { MessageResponse } from "../../../types/message";

// Fetch messages for a specific chat
const fetchMessages = async (chatId: string): Promise<MessageResponse> => {
    const response = await axiosInstance.get<MessageResponse>(`/messages/${chatId}`);
    return response.data;
};



// ustom hook to manage messages and sending functionality
const useMessage = () => {
    const { isOpen, chatId } = useCurrentChat();

    // fetch chat messages
    const { data: messagesData, isLoading, error } = useQuery<MessageResponse, Error>({
        queryKey: ['chat-messages', chatId],
        queryFn: () => fetchMessages(chatId),
        staleTime: 1000 * 60 * 5,
        enabled: !!chatId // only fetch if chatId is present
    });



    return { isOpen, chatId, messagesData, isLoading, error };

};

export default useMessage;
