export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    isOnline: boolean;
}
export const EMAIL_AUTHED = "bouchamajob@gmail.com"

export const users: User[] = [
    {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        isOnline: true,
    },
    {
        id: "2",
        name: "Bob Smith",
        email: "bob.smith@example.com",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        isOnline: false,
    },
    {
        id: "3",
        name: "Carla Martinez",
        email: "carla.martinez@example.com",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        isOnline: true,
    },
    {
        id: "4",
        name: "David Lee",
        email: "david.lee@example.com",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        isOnline: false,
    },
    {
        id: "5",
        name: "Evelyn Garcia",
        email: "evelyn.garcia@example.com",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
        isOnline: true,
    },
];
