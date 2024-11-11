
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EMAIL_AUTHED } from '../dummyData/users';
import axiosInstance from '../utils/axiosInstance';
import { Chat, ChatResponse } from '../types/chat';

// Simulated async function to fetch all chats
const fetchChats = async (): Promise<Chat[]> => {
    const response = await axiosInstance.get<ChatResponse>('/chats');
    return response.data;
};

// Types for the hooks
interface SendMessageData {
    chatId: string;
    body: string;
    image?: string;
}

export const useChats = () => {
    return useQuery<Chat[], Error>({
        queryKey: ['chats'],
        queryFn: fetchChats,
        staleTime: 1000 * 60 * 5,
    });
};


// export const useChat = (chatId: string) => {
//     return useQuery<Chat | undefined, Error>({
//         queryKey: ['chat', chatId],
//         queryFn: async () => {
//             if (!chatId) throw new Error('Chat ID is required');
//             return findOneChat(chatId);
//         },
//         enabled: !!chatId,
//         // staleTime: 1000 * 60 * 5,
//     });
// };

// export const useSendMessage = () => {
//     const queryClient = useQueryClient();

//     return useMutation<Message | null, Error, SendMessageData>({
//         mutationFn: async ({ chatId, body, image }) => {
//             // Simulate network delay
//             await new Promise(resolve => setTimeout(resolve, 200));

//             // Get the current user's ID
//             const currentUser = chats[0].users.find(user => user.email === EMAIL_AUTHED);
//             if (!currentUser) throw new Error('User not authenticated');

//             return addMessageToChat(chatId, currentUser.id, body, image);
//         },
//         onSuccess: (newMessage, { chatId }) => {
//             // Invalidate and refetch the affected queries
//             queryClient.invalidateQueries({ queryKey: ['chats'] });
//             queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
//         },
//     });
// };

// // Optional: Hook to get the current user's chats stats
// export const useChatStats = () => {
//     return useQuery({
//         queryKey: ['chatStats'],
//         queryFn: async () => {
//             await new Promise(resolve => setTimeout(resolve, 50));

//             const userChats = chats.filter(chat =>
//                 chat.users.some(user => user.email === EMAIL_AUTHED)
//             );

//             const unreadCount = userChats.reduce((count, chat) => {
//                 const lastMessage = chat.messages[chat.messages.length - 1];
//                 if (lastMessage && !lastMessage.seen.some(user => user.email === EMAIL_AUTHED)) {
//                     return count + 1;
//                 }
//                 return count;
//             }, 0);

//             return {
//                 totalChats: userChats.length,
//                 unreadCount,
//                 groupChats: userChats.filter(chat => chat.isGroup).length,
//                 directChats: userChats.filter(chat => !chat.isGroup).length,
//             };
//         },
//         staleTime: 1000 * 60,
//     });
// };