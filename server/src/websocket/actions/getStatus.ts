import { io } from ".."
import type { ICallbackParams } from "@shared/callback.type"
import type { IStatus } from "@shared/status.type"

export const getStatus = (socketId: string): Promise<IStatus> => {
	return new Promise((resolve, reject) => {
		const socket = io.sockets.sockets.get(socketId);
		
		if (!socket) {
			reject(new Error('Socket not found'));
			return;
		}

		// Set a timeout for the acknowledgment
		const timeout = setTimeout(() => {
			reject(new Error("Operation has timed out"));
		}, 5000); // 5 second timeout

		// Emit the event to the client and wait for the response
		socket.emit('getStatus', (response: ICallbackParams<IStatus>) => {
			clearTimeout(timeout);
			if (response.success && response.data) {
				resolve(response.data);
			} else {
				reject(new Error(response.error || 'Failed to get status'));
			}
		});
	});
}
