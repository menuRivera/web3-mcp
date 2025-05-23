import { Server } from "socket.io";
import { createServer } from "http";
import type { IMessageToServer } from "@shared/messageToServer.type";
import type { ICallbackParams } from "@shared/callback.type";
import { chains } from "../config/chains";

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	}
});

// Store connected wallets
const connectedWallets = new Map<string, string>(); // socketId -> walletAddress

io.on("connection", (socket) => {
	// Store the socket ID in the socket data
	socket.data = { socketId: socket.id };

	socket.on('messageToServer', async (msg: IMessageToServer) => {
		// Handle messageToServer event
	});

	socket.on('disconnectWallet', (callback: (response: ICallbackParams) => void) => {
		try {
			const walletAddress = connectedWallets.get(socket.id);
			
			if (!walletAddress) {
				throw new Error('No wallet connected for this socket');
			}

			// Remove the wallet from our connected wallets map
			connectedWallets.delete(socket.id);

			// Acknowledge successful disconnection
			if (typeof callback === 'function') {
				const response: ICallbackParams = {
					success: true,
					data: { walletAddress }
				};
				callback(response);
			}
		} catch (error) {
			if (typeof callback === 'function') {
				const response: ICallbackParams = {
					success: false,
					data: null,
					error: error instanceof Error ? error.message : 'Failed to disconnect wallet'
				};
				callback(response);
			}
		}
	});

	// Handle socket disconnection
	socket.on('disconnect', () => {
		// Clean up the wallet connection if the socket disconnects
		connectedWallets.delete(socket.id);
	});

	socket.on('getChains', (callback: (response: ICallbackParams) => void) => {
		try {
			if (typeof callback === 'function') {
				const response: ICallbackParams = {
					success: true,
					data: chains
				};
				callback(response);
			}
		} catch (error) {
			if (typeof callback === 'function') {
				const response: ICallbackParams = {
					success: false,
					data: null,
					error: error instanceof Error ? error.message : 'Failed to get chains information'
				};
				callback(response);
			}
		}
	});
});

export { io, httpServer };
