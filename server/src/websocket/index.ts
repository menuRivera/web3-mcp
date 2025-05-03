import { Server } from "socket.io";
import type { IMessageToServer } from "../types/messageToServer.type";
import { createServer } from "http";
import type { ICallbackParams } from "../types/callback.type";

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	}
});

io.on("connection", (socket) => {
	socket.on('messageToServer', async (msg: IMessageToServer) => {
		// Handle messageToServer event
	});

	socket.on('connectWallet', (callback: (response: ICallbackParams) => void) => {
		// Here you would implement your wallet connection logic
		// For now, we'll just acknowledge with a success response
		if (typeof callback === 'function') {
			const response: ICallbackParams = {
				success: true,
				data: null
			};
			callback(response);
		}
	});
});

export { io, httpServer };
