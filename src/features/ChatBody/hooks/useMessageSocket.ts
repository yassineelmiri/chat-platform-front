import { useEffect, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socket from '../../../utils/socket';

export const useMessageSocket = (chatId?: string) => {
    const queryClient = useQueryClient();
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (chatId) {
            socket.emit('join:chat', chatId);
        }

        const handleNewMessage = (message: any) => {

            console.log(message)
            console.log('socketmsg')
            queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
        };

        const handleTypingStart = (data: { userId: string; chatId: string }) => {
            setTypingUsers(prev => new Set([...prev, data.userId]));
        };

        const handleTypingStop = (data: { userId: string; chatId: string }) => {
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        };

        socket.on('new:message', handleNewMessage);
        socket.on('typing:start', handleTypingStart);
        socket.on('typing:stop', handleTypingStop);

        return () => {
            if (chatId) {
                socket.emit('leave:chat', chatId);
            }
            socket.off('new:message', handleNewMessage);
            socket.off('typing:start', handleTypingStart);
            socket.off('typing:stop', handleTypingStop);
        };
    }, [chatId, queryClient]);

    const sendTypingStatus = useCallback((isTyping: boolean) => {
        if (chatId) {
            socket.emit('typing', { chatId, isTyping });
        }
    }, [chatId]);

    return {
        isConnected: socket.connected,
        sendTypingStatus,
        typingUsers: Array.from(typingUsers)
    };
};

export default useMessageSocket;