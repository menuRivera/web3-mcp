import { io } from ".."
import type { ICallbackParams } from "@shared/callback.type"
import type { INetwork } from "@shared/network.type"

export const changeNetwork = (network: INetwork): Promise<boolean> => {
	return new Promise((resolve) => {
		io.emit('changeNetwork', network, ({ success }: ICallbackParams) => {
			resolve(success)
		})
	})
}
