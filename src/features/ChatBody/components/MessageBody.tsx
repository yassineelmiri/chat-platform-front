import React, { useMemo, useRef, useEffect } from "react";
import MessageBox from "./MessageBox";
import EmptyState from "../../../components/EmptyState";
import useMessage from "../hooks/useMessage";
import useMessageSocket from "../hooks/useMessageSocket";
import TypingIndicator from "../../../components/TypingIndicator";

const MessageBody: React.FC = () => {
    const { isOpen, chatId, messagesData, isLoading, error } = useMessage();
    const { isConnected, typingUsers } = useMessageSocket(chatId);
    const messages = useMemo(() => messagesData, [messagesData, chatId]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!chatId) return <EmptyState />;
    if (!isConnected) return <div>Connecting to chat...</div>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>;
    if (!messagesData) return null;

    return (
        <div className="flex flex-col overflow-y-auto max-h-[70%]">
            {messages?.length ? messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message._id}
                    data={message}
                />
            )) : <p className="flex justify-center items-center">No messages yet. Send the first one!</p>}
            {typingUsers.map(userId => (
                <TypingIndicator
                    key={userId}
                    userId={userId}
                    username="User"
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageBody;