import { useQuery } from '@tanstack/react-query';
import useChat from '../../../hooks/useChat';
import EmptyState from '../../../components/EmptyState';
import { Chat, findOneChat } from '../../../dummyData/chats';
import Header from './Header';

const ChatBody = () => {
    const { isOpen, chatId } = useChat();

    const { data: chat, error, isLoading } = useQuery<Chat>({
        queryKey: ['chat', chatId],
        queryFn: async () => {
            if (!chatId) {
                throw new Error('No valid conversation ID provided');
            }
            const result = await findOneChat(chatId);
            if (!result) {
                throw new Error('Chat not found');
            }
            return result;
        },
        // Disable the query when there's no chatId
        enabled: !!chatId,
    });

    // Now we can safely return the empty state
    if (!chatId) {
        return (
            <div className="lg:pl-80 h-full w-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    if (!chat) return null;

    return (
        <div className="lg:pl-80 h-full w-full">
            <div className="h-full flex flex-col">
                <Header chat={chat} />
                <div className="flex flex-col flex-grow">
                    {chat.messages && chat.messages.length > 0 ? (
                        <div className="flex-grow">
                            <ul>
                                {chat.messages.map((message) => (
                                    <li key={message.id}>
                                        <p><strong>{message.senderId}</strong>: {message.body}</p>
                                        <p>{message.createdAt.toString()}</p>
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