import { io } from ".."
import type { ICallbackParams } from "../../types/callback.type"

export const disconnectWallet = (): Promise<boolean> => {
	return new Promise((resolve) => {
		io.emit('disconnectWallet', ({ success }: ICallbackParams) => {
			resolve(success)
		})
	})
}
