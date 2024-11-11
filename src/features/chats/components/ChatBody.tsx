import { useQuery } from '@tanstack/react-query';
import useChat from '../../../hooks/useChat';
import EmptyState from '../../../components/EmptyState';
import { Chat, findOneChat } from '../../../dummyData/chats';

const ChatBody = () => {
    const { isOpen, chatId } = useChat();  // get chatid from hook usechat

    // if no chatId is provided, show the empty state
    if (!chatId) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    }

    const { data: chat = [], error, isLoading } = useQuery<Chat, Error>({
        queryKey: ['chat', chatId],
        queryFn: () => findOneChat(chatId),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">

                {/* If the chat has messages render them, else show a prompt to send a message */}
                <div className="flex flex-col flex-grow">
                    {chat?.messages && chat.messages.length > 0 ? (
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
                {/* here i will add input add msg */}
            </div>
        </div>
    );
};

export default ChatBody;
