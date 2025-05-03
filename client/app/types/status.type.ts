import type { INetwork } from "./network.type";

export interface IStatus {
	activeAccount: string,
	accounts: string[],
	network: INetwork
}
