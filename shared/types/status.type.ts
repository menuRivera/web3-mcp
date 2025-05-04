import type { INetwork } from "./network.type";

export interface IStatus {
	activeAccount: string,
	accounts: string[],
	network: INetwork,
	balance: {
		native: string,  // Native currency balance (e.g., ETH)
		tokens: {        // Token balances
			[contractAddress: string]: {
				symbol: string,
				balance: string,
				decimals: number
			}
		}
	}
}
