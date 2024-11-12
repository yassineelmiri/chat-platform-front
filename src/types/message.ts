import { Member } from "./chat";

export type Message = {
    _id: string;
    sender: Member;
    chat: string;
    content: string;
    readBy: Member[];
    type: "text" | "image" | "video" | "file";
    createdAt: string;
    updatedAt: string;
    __v: number;
};


export type MessageResponse =  Message[];
