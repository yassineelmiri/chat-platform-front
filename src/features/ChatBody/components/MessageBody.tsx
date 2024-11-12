import React, { useMemo, useRef, useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import EmptyState from "../../../components/EmptyState";
import useMessage from "../hooks/useMessage";
import { useSocketConnection } from "../../../hooks/useSocket";

const MessageBody: React.FC = () => {
    const { isOpen, chatId, messagesData, isLoading, error } = useMessage();
    const [messages, setMessages] = useState(messagesData);
    const bottomRef = useRef<HTMLDivElement>(null);
    const socket = useSocketConnection(chatId);

    useEffect(() => {
        setMessages(messagesData);
    }, [messagesData]);

    useEffect(() => {
        if (chatId) {
            //  here i notif if i join the chat  
            socket.emit('joinChat', chatId);

            // Listen for new messages
            socket.on('newMessage', ({ message }) => {
                setMessages((prev) => prev ? [...prev, message] : [message]);
            });

            // cleanup when component unmounts
            return () => {
                socket.emit('leaveChat', chatId);
                socket.off('newMessage');
            };
        }
    }, [chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!chatId) return <EmptyState />;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>;
    if (!messages) return null;

    return (
        <div className="flex flex-col overflow-y-auto max-h-[70%]">
            {messages.length ? messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message._id}
                    data={message}
                />
            )) : <p className="flex justify-center items-center">No messages yet. Send the first one!</p>}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageBody;