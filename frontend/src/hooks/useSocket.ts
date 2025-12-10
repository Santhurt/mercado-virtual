import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocket = (token: string | null) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        // Create connection with authentication (Bearer Token)
        socketRef.current = io(SOCKET_URL, {
            auth: { token: `Bearer ${token}` },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        const socket = socketRef.current;

        // Connection events
        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            setIsConnected(true);
            setError(null);
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Connection error:', err.message);
            setError(err.message);
            setIsConnected(false);
        });

        socket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
            setIsConnected(false);
        });

        // Cleanup: disconnect on unmount
        return () => {
            socket.disconnect();
        };
    }, [token]);

    return { socket: socketRef.current, isConnected, error };
};
