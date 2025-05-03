import { io } from ".."
import type { ICallbackParams } from "../../types/callback.type"

export const callContractFunction = (contractAddress: string, functionName: string, abi: any[], args: string[]): Promise<string> => {
	return new Promise((resolve) => {
		io.emit('callContractFunction', contractAddress, functionName, abi, args, ({ success, data }: ICallbackParams<string>) => {
			if (success) resolve(data)
		})
	})
}
