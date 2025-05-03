import { io } from "..";
import type { ICallbackParams } from "@shared/callback.type";

export const connectWallet = (): Promise<ICallbackParams> => {
	return new Promise((resolve, reject) => {
		// Get the first connected socket
		const sockets = Array.from(io.sockets.sockets.values());
		if (sockets.length === 0) {
			reject(new Error("No connected clients"));
			return;
		}

		const socket = sockets[0];

		// Set a timeout for the acknowledgment
		const timeout = setTimeout(() => {
			reject(new Error("Operation has timed out"));
		}, 5000); // 5 second timeout

		socket.emit('connectWallet', (response: ICallbackParams) => {
			clearTimeout(timeout);
			resolve(response);
		});
	});
};
