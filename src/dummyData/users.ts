export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    isOnline: boolean;
}
export const EMAIL_AUTHED = "sisko92@gmail.com"

export const users: User[] = [
    {
        id: "1",
        username: "Alice Johnson",
        email: "alice.johnson@example.com",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        isOnline: true,
    },
    {
        id: "2",
        username: "Bob Smith",
        email: "bob.smith@example.com",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        isOnline: false,
    },
    {
        id: "3",
        username: "Carla Martinez",
        email: "carla.martinez@example.com",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        isOnline: true,
    },
    {
        id: "4",
        username: "David Lee",
        email: "david.lee@example.com",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        isOnline: false,
    },
    {
        id: "5",
        username: "Evelyn Garcia",
        email: "evelyn.garcia@example.com",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
        isOnline: true,
    },
];
