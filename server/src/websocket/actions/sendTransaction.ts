import { io } from ".."
import type { ICallbackParams } from "@shared/callback.type"

export const sendTransaction = (to: string, value: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		// Get the first connected socket
		const socketId = io.sockets.sockets.keys().next().value;
		if (!socketId) {
			reject(new Error('No connected clients found'));
			return;
		}

		// Emit the transaction request to the specific socket
		io.to(socketId).emit('sendTransaction', to, value, ({ success, data, error }: ICallbackParams<string>) => {
			if (success) {
				resolve(data);
			} else {
				// ojito
				reject(new Error(error || 'Failed to send transaction'));
			}
		});
	});
}
