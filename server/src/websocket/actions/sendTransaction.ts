import { io } from ".."
import type { ICallbackParams } from "@shared/callback.type"

export const sendTransaction = (to: string, value: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		io.emit('sendTransaction', to, value, ({ success, data, error }: ICallbackParams<string>) => {
			if (success) {
				resolve(data);
			} else {
				reject(new Error(error || 'Failed to send transaction'));
			}
		});
	});
}
