import { useQuery } from "@tanstack/react-query";
import useCurrentChat from "../../../hooks/useCurrentChat";
import axiosInstance from "../../../utils/axiosInstance";
import { MessageResponse } from "../../../types/message";


const fetchMessages = async (chatId: string): Promise<MessageResponse> => {
    const response = await axiosInstance.get<MessageResponse>(`/messages/${chatId}`);
    return response.data;
};

const useMessage = () => {
    const { isOpen, chatId } = useCurrentChat();
    const { data: messagesData, isLoading, error } = useQuery<MessageResponse, Error>({
        queryKey: ['chat-messages', chatId],
        queryFn: () => fetchMessages(chatId),
        staleTime: 1000 * 60 * 5,
    });



    return { isOpen, chatId, messagesData, isLoading, error };
};

export default useMessage;
