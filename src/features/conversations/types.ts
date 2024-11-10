


// Define the types for the conversation and props
export interface Participant {
    username: string;
    email: string; // Add other fields as necessary
}

export interface Conversation {
    _id: string;
    participants: Participant[];
    messages: any[]; // Define your message type if needed
}

export interface ConversationBodyProps {
    userId: string;
}

// Define the type for the create conversation parameters
export interface CreateConversationParams {
    withUser: string;
    message?: string;
}