import React from "react";
import clsx from "clsx";
import AvatarGroup from "../../../components/AvatarGroup";
import Avatar from "../../../components/Avatar";
import { Chat } from "../../../types/chat";
import useChatBox from "../hooks/useChatBox";

interface ChatBoxProps {
    chat: Chat;
    selected?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ chat, selected }) => {
    const { handleClick, otherUser, lastMessageText, formattedDate } = useChatBox({ chat });
    return (
        <div
            onClick={handleClick}
            className={clsx(
                `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
                selected ? "bg-neutral-100" : "bg-white"
            )}
        >
            {chat.isGroup ? <AvatarGroup users={chat.members} /> : <Avatar user={otherUser} />}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-medium text-gray-900">
                            {chat.isGroup ? chat.name : otherUser?.username || "Deleted User"}
                        </p>
                        {formattedDate && (
                            <p className="text-xs text-gray-400 font-light">{formattedDate}</p>
                        )}
                    </div>
                    <p
                        className={clsx(
                            `truncate text-sm`,
                            chat?.lastMessage ? "text-gray-500" : "text-black font-medium"
                        )}
                    >
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
