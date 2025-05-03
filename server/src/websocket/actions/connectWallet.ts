import { io } from ".."

export const connectWallet = async (): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		try {
			io.volatile.emit('connectWallet', (res: any) => {
				console.log(res)
			})
			resolve(true)
		} catch (error) {
			reject(error)
		}
	})
}
