
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || '', {
  autoConnect: false,
  auth: {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }
});

export default socket;