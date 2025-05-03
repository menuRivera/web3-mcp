import { io } from ".."
import type { ICallbackParams } from "../../types/callback.type"

export const sendTransaction = (to: string, value: string): Promise<string> => {
	return new Promise((resolve) => {
		io.emit('sendTransaction', to, value, ({ success, data }: ICallbackParams<string>) => {
			if (success) resolve(data)
		})
	})
}
