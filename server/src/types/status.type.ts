import type { INetwork } from "./network.type";

export interface IStatus {
	activeWallet: string,
	accounts: string[],
	network: INetwork
}
