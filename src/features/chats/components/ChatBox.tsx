
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import AvatarGroup from "../../../components/AvatarGroup";
import Avatar from "../../../components/Avatar";
import { format } from "date-fns";
import useOtherUser from "../../../hooks/useOtherUser";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../providers/AuthProvider";

import { Chat } from "../../../types/chat";


interface ChatBoxProps {
    chat: Chat,
    selected?: boolean;
}


const ChatBox: React.FC<ChatBoxProps> = ({
    chat,
    selected
}) => {
    const navigate = useNavigate();

    const { user } = useAuth()
    const otherUser = useOtherUser(chat.members);
    const handleClick = useCallback(() => {
        navigate(`/chat/${chat._id}`);

        // when click on conversation 
    }, [chat]);



    // const lastMessage = useMemo(() => {
    //     const messages = chat.messages || [];

    //     return messages[messages.length - 1];
    // }, [chat.lastMessage]);



    const userEmail = useMemo(() => user?.email,
        [user?.email]);



    const lastMessageText = useMemo(() => {


        if (chat?.lastMessage) {
            return chat?.lastMessage
        }

        return 'Started a conversation';
    }, [chat?.lastMessage]);

    return (
        <div
            onClick={handleClick}
            className={clsx(`
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
                selected ? 'bg-neutral-100' : 'bg-white'
            )}
        >
            {chat.isGroup ? (
                <AvatarGroup users={chat.members} />
            ) : (
                <Avatar user={otherUser} />
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-medium text-gray-900">
                            {chat.isGroup ? chat.name : otherUser?.username}
                        </p>
                        {chat?.createdAt && (
                            <p
                                className="
                  text-xs 
                  text-gray-400 
                  font-light
                "
                            >
                                {format(new Date(chat.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p
                        className={clsx(`
              truncate 
              text-sm
              `,
                            false ? 'text-gray-500' : 'text-black font-medium'
                        )}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;