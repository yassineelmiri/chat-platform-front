import React, { useMemo, useRef, useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import EmptyState from "../../../components/EmptyState";
import useMessage from "../hooks/useMessage";
import socket from "../../../utils/socket"; // Import your socket instance

const MessageBody: React.FC = () => {
    const { isOpen, chatId, messagesData, isLoading, error } = useMessage();
    const [messages, setMessages] = useState(messagesData); // State to manage real-time messages
    const bottomRef = useRef<HTMLDivElement>(null);

    // Sync messagesData with local messages state whenever it updates
    useEffect(() => {
        setMessages(messagesData);
    }, [messagesData]);

    // Setup socket listener for new messages
    useEffect(() => {
        if (!chatId) return;

        // Join chat room with the current chatId
        socket.emit("joinRoom", chatId);

        // Listen for new messages from server
        socket.on("newMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });

        // Cleanup on component unmount or chatId change
        return () => {
            socket.emit("leaveRoom", chatId);
            socket.off("newMessage");
        };
    }, [chatId]);

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
