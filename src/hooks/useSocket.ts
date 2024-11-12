
import { useEffect } from 'react';
import socket from '../utils/socket';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';

export const useSocketConnection = (chatId: string) => {
    const queryClient = useQueryClient();


    const { token } = useAuth()
    
    useEffect(() => {
        // Connect with authentication
        socket.auth = { token }
        socket.connect();

        // Handle connection events
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Handle user status updates
        socket.on('userConnected', (data) => {
            queryClient.invalidateQueries({ queryKey: ['chat-members', chatId] });
            console.log(`User ${data.username} is now online`);
        });

        socket.on('userDisconnected', (data) => {
            queryClient.invalidateQueries({ queryKey: ['chat-members', chatId] });
            console.log(`User ${data.username} is now offline`);
        });

        socket.on('userJoinedChat', (data) => {
            console.log(`${data.username} joined the chat`);
        });

        socket.on('userLeftChat', (data) => {
            console.log(`${data.username} left the chat`);
        });

        // Cleanup
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('userConnected');
            socket.off('userDisconnected');
            socket.off('userJoinedChat');
            socket.off('userLeftChat');
            socket.disconnect();
        };
    }, [chatId, queryClient]);

    return socket;
};