import { io } from ".."
import type { ICallbackParams } from "../../types/callback.type"
import type { INetwork } from "../../types/network.type"

export const changeNetwork = (network: INetwork): Promise<boolean> => {
	return new Promise((resolve) => {
		io.emit('changeNetwork', network, ({ success }: ICallbackParams) => {
			resolve(success)
		})
	})
}
