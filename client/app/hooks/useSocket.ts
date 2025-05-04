import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { BrowserProvider } from 'ethers';
import type { ICallbackParams } from '@shared/callback.type';
import type { IStatus } from '@shared/status.type';

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

		// Listen for getStatus event
		socketRef.current.on('getStatus', async (callback: (response: ICallbackParams<IStatus | null>) => void) => {
			console.log('getStatus triggered');
			try {
				if (!window.ethereum) {
					throw new Error('No crypto wallet found. Please install MetaMask.');
				}

				// Create a BrowserProvider instance
				const provider = new BrowserProvider(window.ethereum);

				// Get current network
				const network = await provider.getNetwork();

				// Get accounts
				const accounts = await provider.send('eth_accounts', []);

				if (!accounts || accounts.length === 0) {
					throw new Error('No accounts found');
				}
				// Get token data from the network
				const feeData = await provider.getFeeData();
				const nativeCurrency = {
					name: network.name === 'homestead' ? 'Ether' : network.name,
					symbol: network.name === 'homestead' ? 'ETH' : 'Unknown',
					decimals: 18 // Standard for most EVM chains
				};

				const status: IStatus = {
					activeAccount: accounts[0],
					accounts,
					network: {
						chainId: Number(network.chainId),
						name: network.name,
						currency: nativeCurrency
					}
				};

				callback({ success: true, data: status });
			} catch (error) {
				console.error('Error getting status:', error);
				callback({
					success: false,
					data: null,
					error: error instanceof Error ? error.message : 'Failed to get status'
				});
			}
		});

		// Listen for walletConnect event
		socketRef.current.on('connectWallet', async (callback) => {
			console.log('connectWallet triggered')
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

		// Listen for disconnectWallet event
		socketRef.current.on('disconnectWallet', async (callback) => {
			console.log('disconnectWallet triggered');
			try {
				if (!window.ethereum) {
					throw new Error('No crypto wallet found.');
				}

				// Create a BrowserProvider instance
				const provider = new BrowserProvider(window.ethereum);

				// Remove all event listeners from the ethereum provider
				window.ethereum.removeAllListeners('accountsChanged');
				window.ethereum.removeAllListeners('chainChanged');
				window.ethereum.removeAllListeners('disconnect');

				// Clear MetaMask's localStorage keys
				Object.keys(localStorage).forEach(key => {
					if (key.startsWith('metamask') || key.startsWith('walletconnect')) {
						localStorage.removeItem(key);
					}
				});

				// Revoke permissions to disconnect
				await provider.send('wallet_revokePermissions', [{
					eth_accounts: {}
				}]);

				// Send acknowledgment back to server
				callback({ success: true, data: null });
			} catch (error) {
				console.error('Error disconnecting wallet:', error);
				callback({
					success: false,
					error: error instanceof Error ? error.message : 'Failed to disconnect wallet'
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
