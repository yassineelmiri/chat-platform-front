
<<<<<<< HEAD
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || '';

const socket: Socket = io(API_URL, {
    transports: ['websocket'],
    withCredentials: true,
});

// Optional: Add connection event listeners for debugging
socket.on('connect', () => {
    console.log('Socket connected');
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

=======
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || '', {
  autoConnect: false,
  auth: {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }
});

>>>>>>> add-Socketio
export default socket;