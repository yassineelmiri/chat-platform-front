import axiosInstance from "../../utils/axiosInstance";
import { CreateConversationParams } from "./types";

// Fetch user conversations
export const fetchUserConversations = async (userId: string) => {
    const { data } = await axiosInstance.get(`/conversations/user/${userId}`);
    return data;
};

// Create a new conversation
export const createConversation = async ({ withUser, message }: CreateConversationParams) => {
    const { data } = await axiosInstance.post('/conversations', { withUser, message });
    return data;
};