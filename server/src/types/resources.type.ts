export interface IContractResource {
	name: string;
	address: string;
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
