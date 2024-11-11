import React from 'react';
import EmptyState from '../../../components/EmptyState';
import Header from './Header';
import useCurrentChat from '../../../hooks/useCurrentChat';

const ChatBody: React.FC = () => {
    const { isOpen, chatId } = useCurrentChat();
    // const { data: chat, isLoading, error } = useChat(chatId);

    if (!chatId || true) {
        return (
            <div className="lg:pl-80 h-full w-full">
                <div className="flex flex-col h-full">
                    <EmptyState />
                </div>
            </div>
        );
    }

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    // if (!chat) return null;

    return (
        <div className="lg:pl-80 h-full w-full">
            <div className="h-full flex flex-col">
                <Header chat={[chat]} />
                <div className="flex flex-col flex-grow bg-[#DBEAFE] h-auto p-6 w-full">
                    {chat.messages && chat.messages.length > 0 ? (
                        <div className="flex-grow">
                            <ul>
                                {chat.messages.map((message) => (
                                    <li key={message.id} className="mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src={chat.users.find(user => user.id === message.senderId)?.avatar}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <p className="font-bold">{message.senderId}</p>
                                        </div>
                                        <p className="ml-10">{message.body}</p>
                                        <p className="ml-10 text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex-grow flex justify-center items-center">
                            <p>No messages yet. Send the first one!</p>
                        </div>
                    )}
                </div>
                {/* Input for adding messages will go here */}
            </div>
        </div>
    );
};

export default ChatBody;