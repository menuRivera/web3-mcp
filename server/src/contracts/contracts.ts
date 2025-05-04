import type { IContractResource } from "@shared/resources.type";

export const contracts: Record<string, IContractResource> = {
	"usdc": {
		name: "USDC",
		chain: "ethereum", 
		addresses: {
			"ethereum": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
			"polygon": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
			"arbitrum": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
			"optimism": "0x7F5c764cBc14f9669F88837ca1490cCa17c31607",
			"base": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
		},
		abi: [
			{
				"inputs": [],
				"name": "decimals",
				"outputs": [{"type": "uint8"}],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [{"name": "account", "type": "address"}],
				"name": "balanceOf",
				"outputs": [{"type": "uint256"}],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{"name": "recipient", "type": "address"},
					{"name": "amount", "type": "uint256"}
				],
				"name": "transfer",
				"outputs": [{"type": "bool"}],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		],
		functions: ["decimals", "balanceOf", "transfer"],
		examples: [
			{
				functionName: "balanceOf",
				description: "Get USDC balance of an address",
				exampleArgs: ["0x1234...5678"]
			},
			{
				functionName: "transfer",
				description: "Transfer USDC tokens to an address",
				exampleArgs: ["0x1234...5678", "1000000"] // 1 USDC (6 decimals)
			}
		]
	}
};