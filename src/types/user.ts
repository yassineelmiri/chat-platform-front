export interface User {
    _id: string;
    username: string;
    avatar: string;
    email: string;
    password: string;
    role: "user";
    status: "ONLINE" | "OFFLINE";
    reputation: number;
    timestamp: string;

}