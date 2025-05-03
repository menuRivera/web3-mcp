import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { BrowserProvider } from 'ethers';

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
		socketRef.current.on('connectWallet', async (callback) => {
			console.log('connectWallet triggeredddd')
			// Request wallet connection using ethers
			try {
				if (!window.ethereum) {
					throw new Error('No crypto wallet found. Please install MetaMask.');
				}

				// Create a BrowserProvider instance
				const provider = new BrowserProvider(window.ethereum);

				// Request account access
				const accounts = await provider.send('eth_requestAccounts', []);

				if (!accounts || accounts.length === 0) {
					throw new Error('No accounts found');
				}

				const address = accounts[0];
				console.log('Wallet connected:', address);
				callback({ success: true, data: null })
			} catch (error) {
				console.error('Error connecting wallet:', error);
				callback({
					success: false,
					error: error instanceof Error ? error.message : 'Failed to connect wallet'
				});
			}
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
