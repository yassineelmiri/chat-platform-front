import { StatusUser } from "./chat";

export interface User {
    _id: string;
    username: string;
    avatar: string;
    email: string;
    password: string;
    role: "user";
    status: StatusUser;
    reputation: number;
    timestamp: string;

}