import { EMAIL_AUTHED, User } from "./users";

export interface Message {
  id: string;
  senderId: string;
  body?: string;
  image?: string;
  createdAt: Date;
  seen: User[];
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  users: User[];
  messages: Message[];
}

export const chats: Chat[] = [
  {
    id: "101",
    name: "Project Team",
    isGroup: true,
    users: [
      { id: "1", name: "Alice Johnson", email: EMAIL_AUTHED, avatar: "https://randomuser.me/api/portraits/women/1.jpg", isOnline: true },
      { id: "2", name: "Bob Smith", email: "bob.smith@example.com", avatar: "https://randomuser.me/api/portraits/men/2.jpg", isOnline: false },
      { id: "3", name: "Carla Martinez", email: "carla.martinez@example.com", avatar: "https://randomuser.me/api/portraits/women/3.jpg", isOnline: true },
    ],
    messages: [
      {
        id: "m1",
        senderId: "1",
        body: "Hey team, are we ready for the meeting?",
        createdAt: new Date("2024-11-11T09:00:00Z"),
        seen: [{ id: "2", name: "Bob Smith", email: "bob.smith@example.com", avatar: "https://randomuser.me/api/portraits/men/2.jpg", isOnline: false }],
      },
      {
        id: "m2",
        senderId: "3",
        body: "Yes, I'll be there!",
        createdAt: new Date("2024-11-11T09:05:00Z"),
        seen: [],
      },
    ],
  },
  {
    id: "102",
    isGroup: false,
    users: [
      { id: "1", name: "Alice Johnson", email: EMAIL_AUTHED, avatar: "https://randomuser.me/api/portraits/women/1.jpg", isOnline: true },
      { id: "4", name: "David Lee", email: "david.lee@example.com", avatar: "https://randomuser.me/api/portraits/men/4.jpg", isOnline: false },
    ],
    messages: [
      {
        id: "m3",
        senderId: "1",
        body: "Hi David, did you finish the report?",
        createdAt: new Date("2024-11-10T14:00:00Z"),
        seen: [{ id: "4", name: "David Lee", email: "david.lee@example.com", avatar: "https://randomuser.me/api/portraits/men/4.jpg", isOnline: false }],
      },
      {
        id: "m4",
        senderId: "4",
        body: "Almost done, I'll send it tonight.",
        createdAt: new Date("2024-11-10T14:30:00Z"),
        seen: [{ id: "1", name: "Alice Johnson", email: EMAIL_AUTHED, avatar: "https://randomuser.me/api/portraits/women/1.jpg", isOnline: true }],
      },
    ],
  },
];

// Function to add a message to a chat
export function addMessageToChat(
  chatId: string,
  senderId: string,
  body: string,
  image?: string
): Message | null {
  // Find the chat by chatid
  const chat = chats.find((conv) => conv.id === chatId);

  if (!chat) {
    console.error(`chat with ID ${chatId} not found.`);
    return null;
  }

  // Create a new message
  const newMessage: Message = {
    id: `m${chat.messages.length + 1}`,
    senderId,
    body,
    image,
    createdAt: new Date(),
    seen: [],  // Initially, no one has seen the message
  };

  // Add the new message to the chat's messages array
  chat.messages.push(newMessage);

  return newMessage;
}


// Fetch one chat 
export const findOneChat = async (chatId: string) => {

  return chats.find(item => item.id === chatId)

};