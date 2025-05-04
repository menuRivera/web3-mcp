export interface INetwork {
	chainId: number,
	name: string,
	currency: {
		name: string,
		symbol: string,
		decimals: number,
	},
	rpcUrls?: string[],
	blockExplorerUrls?: string[]
}

export interface IChainInfo {
	name: string,
	chainId: number,
	currency: {
		name: string,
		symbol: string,
		decimals: number,
	},
	rpcUrls: string[],
	blockExplorerUrls: string[],
}

export interface IChainsResponse {
	[key: string]: IChainInfo,
}
