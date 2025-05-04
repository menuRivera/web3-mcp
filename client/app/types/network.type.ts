export interface INetwork {
	chainId: number,
	name: string,
	currency: {
		name: string,
		symbol: string,
		decimals: number,
	}
	rpcUrls?: string[],
	blockExplorerUrls?: string[]
}
