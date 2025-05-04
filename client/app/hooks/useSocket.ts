import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BrowserProvider, formatUnits } from 'ethers';
import type { ICallbackParams } from '@shared/callback.type';
import type { IStatus } from '@shared/status.type';
import type { INetwork } from '@shared/network.type';
import { Contract } from 'ethers';

const SOCKET_URL = 'ws://localhost:65001';

// Create a single socket instance at module level
let socketInstance: Socket | null = null;

// Connection options
const socketOptions = {
	reconnection: true,
	reconnectionAttempts: Infinity,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	timeout: 20000,
	autoConnect: true,
	forceNew: false,
	transports: ['websocket', 'polling']
};

export const useSocket = () => {
	const socketRef = useRef<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// Initialize socket connection only if it doesn't exist
		if (!socketInstance) {
			socketInstance = io(SOCKET_URL, socketOptions);
		}
		socketRef.current = socketInstance;

		// Set initial connection state
		setIsConnected(socketRef.current.connected);

		// Listen for connect event
		const handleConnect = () => {
			console.log('Socket connected:', socketRef.current?.id);
			setIsConnected(true);
		};

		// Listen for disconnect event
		const handleDisconnect = () => {
			console.log('Socket disconnected');
			setIsConnected(false);
		};

		// Listen for connect_error event
		const handleConnectError = (error: Error) => {
			console.error('Socket connection error:', error);
			setIsConnected(false);
		};

		// Listen for reconnect event
		const handleReconnect = (attemptNumber: number) => {
			console.log('Socket reconnected after', attemptNumber, 'attempts');
			setIsConnected(true);
		};

		// Listen for reconnect_error event
		const handleReconnectError = (error: Error) => {
			console.error('Socket reconnection error:', error);
			setIsConnected(false);
		};

		// Listen for reconnect_failed event
		const handleReconnectFailed = () => {
			console.error('Socket reconnection failed');
			setIsConnected(false);
		};

		// Add event listeners
		socketRef.current.on('connect', handleConnect);
		socketRef.current.on('disconnect', handleDisconnect);
		socketRef.current.on('connect_error', handleConnectError);
		socketRef.current.on('reconnect', handleReconnect);
		socketRef.current.on('reconnect_error', handleReconnectError);
		socketRef.current.on('reconnect_failed', handleReconnectFailed);

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
				console.log('Network:', network);

				// Get accounts
				const accounts = await provider.send('eth_accounts', []);

				if (!accounts || accounts.length === 0) {
					throw new Error('No accounts found');
				}

				const nativeCurrency = {
					name: network.name === 'homestead' ? 'Ether' : network.name,
					symbol: network.name === 'matic' ? 'MATIC' :
					       network.name === 'polygon' ? 'MATIC' :
					       network.name === 'arbitrum-one' ? 'ETH' :
					       network.name === 'arbitrum' ? 'ETH' :
					       'ETH',
					decimals: 18 // Standard for most EVM chains
				};

				// Get native balance and format it
				const balance = await provider.getBalance(accounts[0]);
				const nativeBalance = formatUnits(balance, nativeCurrency.decimals);

				const status: IStatus = {
					activeAccount: accounts[0],
					accounts,
					network: {
						chainId: Number(network.chainId),
						name: network.name,
						currency: nativeCurrency
					},
					balance: {
						native: nativeBalance,
						tokens: {} // Empty tokens object since we're not fetching token balances
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

		// Listen for changeNetwork event
		socketRef.current.on('changeNetwork', async (network, callback) => {
			console.log('changeNetwork triggered');
			try {
				if (!window.ethereum) {
					throw new Error('No crypto wallet found. Please install MetaMask.');
				}

				try {
					// Try to switch to the chain
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{
							chainId: `0x${network.chainId.toString(16)}`
						}]
					});
				} catch (switchError: any) {
					// If the chain is not added (error code 4902), add it
					if (switchError.code === 4902) {
						try {
							await window.ethereum.request({
								method: 'wallet_addEthereumChain',
								params: [{
									chainId: `0x${network.chainId.toString(16)}`,
									chainName: network.name,
									nativeCurrency: network.currency,
									rpcUrls: network.rpcUrls,
									blockExplorerUrls: network.blockExplorerUrls,
								}]
							});
							// Try switching again after adding
							await window.ethereum.request({
								method: 'wallet_switchEthereumChain',
								params: [{
									chainId: `0x${network.chainId.toString(16)}`
								}]
							});
						} catch (addError: any) {
							throw new Error(`Failed to add chain: ${addError.message || 'Unknown error'}`);
						}
					} else {
						throw new Error(`Failed to switch chain: ${switchError.message || 'Unknown error'}`);
					}
				}

				console.log('Network changed to:', network.name);
				callback({ success: true, data: null });
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to change network';
				console.error('Error changing network:', errorMessage);
				callback({
					success: false,
					data: null,
					error: errorMessage
				});
			}
		});

		// Listen for sendTransaction event
		socketRef.current.on('sendTransaction', async (to: string, value: string, callback) => {
			console.log('sendTransaction triggered with params:', { to, value });

			try {
				if (!window.ethereum) {
					const errorMsg = 'No crypto wallet found. Please install MetaMask.';
					callback({ success: false, data: null, error: errorMsg });
					throw new Error(errorMsg);
				}

				const provider = new BrowserProvider(window.ethereum);
				const signer = await provider.getSigner();

				console.log('Got signer for address:', await signer.getAddress());
				console.log('Sending transaction...');

				const tx = await signer.sendTransaction({
					to,
					value: BigInt(value)
				});

				console.log('Transaction sent, waiting for confirmation:', tx.hash);

				const receipt = await tx.wait();

				if (!receipt) {
					const errorMsg = 'Transaction receipt is null';
					callback({ success: false, data: null, error: errorMsg });
					throw new Error(errorMsg);
				}

				console.log('Transaction sent:', receipt.hash);
				callback({ success: true, data: receipt.hash });
			} catch (error) {
				console.error(error)
				const errorMessage = error instanceof Error ? error.message : 'Failed to send transaction';
				console.error('Error sending transaction:', errorMessage);
				callback({
					success: false,
					data: null,
					error: errorMessage
				});
			}
		});

		// Cleanup on unmount
		return () => {
			if (socketRef.current) {
				// Remove all event listeners
				socketRef.current.off('connect', handleConnect);
				socketRef.current.off('disconnect', handleDisconnect);
				socketRef.current.off('connect_error', handleConnectError);
				socketRef.current.off('reconnect', handleReconnect);
				socketRef.current.off('reconnect_error', handleReconnectError);
				socketRef.current.off('reconnect_failed', handleReconnectFailed);
				socketRef.current.off('getStatus');
				socketRef.current.off('connectWallet');
				socketRef.current.off('disconnectWallet');
				socketRef.current.off('changeNetwork');
				socketRef.current.off('sendTransaction');
			}
		};
	}, []);

	return { socket: socketRef.current, isConnected };
}; 
