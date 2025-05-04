export interface IContractResource {
	name: string;
	chain: string;
	addresses: Record<string, string>;
	abi: any[];
	functions: string[];
	examples: Array<{
		functionName: string;
		description: string;
		exampleArgs: any[];
	}>;
}

export interface IChainResource {
	name: string;
	chainId: number;
	currency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	rpcUrls: string[];
	blockExplorerUrls: string[];
} 
