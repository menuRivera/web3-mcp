import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ICallbackParams } from '../types/callback.type';

const SOCKET_URL = 'ws://localhost:65001';

export const useSocket = () => {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		// Initialize socket connection
		socketRef.current = io(SOCKET_URL);

		// Listen for connect event
		socketRef.current.on('connect', () => {
			console.log('Socket connected:', socketRef.current?.id);
		});

		// Listen for walletConnect event
		socketRef.current.on('connectWallet', (callback) => {
			console.log('connectWallet triggered')
			// connect ethereum wallet
			callback({ success: true, data: null })
		});

		// Cleanup on unmount
		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	return socketRef.current;
}; 
