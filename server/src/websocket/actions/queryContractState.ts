import { io } from ".."
import type { ICallbackParams } from "../../types/callback.type"

export const queryContractState = <T>(contractAddress: string, functionName: string, abi: any[], args: string[]): Promise<T> => {
	return new Promise((resolve) => {
		io.emit('queryContractState', contractAddress, functionName, abi, args, ({ success, data }: ICallbackParams<T>) => {
			if (success) resolve(data)
		})
	})
}
