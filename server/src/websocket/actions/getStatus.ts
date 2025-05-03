import { io } from ".."
import type { ICallbackParams } from "@shared/callback.type"
import type { IStatus } from "@shared/status.type"

export const getStatus = (): Promise<IStatus> => {
	return new Promise((resolve) => {
		io.emit('getStatus', ({ success, data }: ICallbackParams<IStatus>) => {
			if (success) resolve(data)
		})
	})
}
