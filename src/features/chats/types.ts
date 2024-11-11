


// Define the types for the Chat and props
export interface Participant {
    username: string;
    email: string; // Add other fields as necessary
}

export interface Chat {
    _id: string;
    participants: Participant[];
    messages: any[]; // Define your message type if needed
}

export interface ChatBodyProps {
    userId: string;
}

// Define the type for the create Chat parameters
export interface CreateChatParams {
    withUser: string;
    message?: string;
}