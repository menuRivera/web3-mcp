import { io } from ".."
import type { ICallbackParams } from "../../types/callback.type"
import type { IStatus } from "../../types/status.type"

export const getStatus = (): Promise<IStatus> => {
	return new Promise((resolve) => {
		io.emit('getStatus', ({ success, data }: ICallbackParams<IStatus>) => {
			if (success) resolve(data)
		})
	})
}
