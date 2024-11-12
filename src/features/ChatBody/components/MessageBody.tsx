import React, { useMemo, useRef } from "react";

import MessageBox from "./MessageBox";
import EmptyState from "../../../components/EmptyState";
import useMessage from "../hooks/useMessage";
interface MessageBodyProps {

}
const MessageBody: React.FC<MessageBodyProps> = () => {


    const { isOpen, chatId, messagesData, isLoading, error } = useMessage(); // fetch list of messages belong this chat
    const messages = useMemo(() => messagesData, [messagesData, chatId]); // cache messages
    const bottomRef = useRef<HTMLDivElement>(null)

    if (!chatId) {
        return (
            <div className="lg:pl-80 max-h-full w-full overflow-y-auto">
                <div className="flex flex-col h-full">
                    <EmptyState />
                </div>
            </div>
        );
    }



    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>;
    if (!messagesData) return null;







    return (
        <div className="flex flex-col overflow-y-auto max-h-[70%]">
            {messages && messages?.length >= 0 ? messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message._id}
                    data={message}
                />
            )) : <div className="flex-grow flex justify-center items-center">
                <p>No messages yet. Send the first one!</p>
            </div>
            }
            <div className="pt-24" ref={bottomRef} />
        </div>
    );
};

export default MessageBody;
