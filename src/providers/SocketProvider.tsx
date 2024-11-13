import React, { createContext, useContext, useEffect, useState } from 'react';
import socket from '../utils/socket';
import { useAuth } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
    socket: typeof socket;
    onlineUsers: Set<string>;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const { token, user } = useAuth();
    const queryClient = useQueryClient();


    useEffect(() => {
        if (token && user) {
            // Initialize socket connection
            socket.auth = { token };
            socket.connect();

            // Connection events
            socket.on('connect', () => {
                setIsConnected(true);
                console.log('Connected to socket server');
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            // User status events
            socket.on('userConnected', (data) => {
                setOnlineUsers(prev => new Set(prev).add(data.userId));
                queryClient.invalidateQueries({ queryKey: ['chat-members'] });
                queryClient.invalidateQueries({ queryKey: ['chats'] });
                toast.success(`${data.username} is now online`, {
                    position: 'bottom-right',
                    duration: 3000,
                });
            });

            socket.on('userDisconnected', (data) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.userId);
                    return newSet;
                });
                queryClient.invalidateQueries({ queryKey: ['chat-members'] });
                queryClient.invalidateQueries({ queryKey: ['chats'] });
                toast(`${data.username} is now offline`, {
                    position: 'bottom-right',
                    duration: 3000,
                });
            });

            // Initial online users
            socket.on('onlineUsers', (users) => {
                setOnlineUsers(new Set(users.map((u: { userId: any; }) => u.userId)));
            });


            // Call notifications
            // socket.on('incomingCall', (data) => {
            //     toast.custom((t) => (
            //         <div className="call-notification">
            //             <p>{data.callerName} is calling...</p>
            //             <div>
            //                 <button onClick={() => handleAcceptCall(data)}>Accept</button>
            //                 <button onClick={() => handleRejectCall(data)}>Reject</button>
            //             </div>
            //         </div>
            //     ), {
            //         duration: 30000,
            //         position: 'top-right',
            //     });
            // });
        }

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('userConnected');
            socket.off('userDisconnected');
            socket.off('onlineUsers');
            // socket.off('incomingCall');
            socket.disconnect();
        };
    }, [token, user, queryClient]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};