import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { 
	connectWallet, 
	disconnectWallet,
	changeNetwork,
	sendTransaction,
	callContractFunction,
	queryContractState,
	getStatus
} from "../websocket/actions";
import type { INetwork } from "../types/network.type";
import type { IStatus } from "../types/status.type";
import { z } from "zod";
import { chains } from "../config/chains";
import type { IContractResource } from "../types/resources.type";

// Mock contract data
const contracts: Record<string, IContractResource> = {
	"usdc": {
		name: "USDC",
		address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
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
			}
		],
		functions: ["decimals", "balanceOf"],
		examples: [
			{
				functionName: "balanceOf",
				description: "Get USDC balance of an address",
				exampleArgs: ["0x1234...5678"]
			}
		]
	},
	"dai": {
		name: "DAI",
		address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
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
			}
		],
		functions: ["decimals", "balanceOf"],
		examples: [
			{
				functionName: "balanceOf",
				description: "Get DAI balance of an address",
				exampleArgs: ["0x1234...5678"]
			}
		]
	}
};

// create mcp server and setup tools and resources
export const mcp = new McpServer({
	name: "web3-mcp-server",
	version: "1.0.0"
});

// Add contract resources
mcp.resource(
	"contracts",
	"contracts://{contractName}",
	async (uri: URL) => {
		const contractName = uri.pathname.slice(1); // Remove leading slash
		if (contractName === "list") {
			return {
				contents: [{
					uri: uri.toString(),
					text: JSON.stringify(Object.keys(contracts), null, 2)
				}]
			};
		}
		const contract = contracts[contractName];
		if (!contract) {
			return {
				contents: [{
					uri: uri.toString(),
					text: `No contract found with name ${contractName}`
				}]
			};
		}

		return {
			contents: [{
				uri: uri.toString(),
				text: JSON.stringify(contract, null, 2)
			}]
		};
	}
);

// Add chain resources
mcp.resource(
	"chains",
	"chains://{chainName}",
	async (uri: URL) => {
		const chainName = uri.pathname.slice(1); // Remove leading slash
		if (chainName === "list") {
			return {
				contents: [{
					uri: uri.toString(),
					text: JSON.stringify(Object.keys(chains), null, 2)
				}]
			};
		}
		const chain = chains[chainName];
		if (!chain) {
			return {
				contents: [{
					uri: uri.toString(),
					text: `No chain found with name ${chainName}`
				}]
			};
		}

		return {
			contents: [{
				uri: uri.toString(),
				text: JSON.stringify(chain, null, 2)
			}]
		};
	}
);

mcp.tool(
	"connectWallet",
	"Connect to the wallet",
	async (extra) => {
		const success = await connectWallet()
		return {
			content: [{ type: "text", text: `Wallet connected: ${success}` }]
		}
	}
)

mcp.tool(
	"disconnectWallet",
	"Disconnect from the wallet",
	async (extra) => {
		const success = await disconnectWallet()
		return {
			content: [{ type: "text", text: `Wallet disconnected: ${success}` }]
		}
	}
)

mcp.tool(
	"changeNetwork",
	{
		chainId: z.number(),
		name: z.string(),
		currency: {
			name: z.string(),
			symbol: z.string(),
			decimals: z.number()
		}
	},
	async (args, extra) => {
		const success = await changeNetwork(args as INetwork)
		return {
			content: [{ type: "text", text: `Network changed: ${success}` }]
		}
	}
)

mcp.tool(
	"sendTransaction",
	{
		to: z.string(),
		value: z.string()
	},
	async (args, extra) => {
		const txHash = await sendTransaction(args.to, args.value)
		return {
			content: [{ type: "text", text: `Transaction sent with hash: ${txHash}` }]
		}
	}
)

mcp.tool(
	"callContractFunction",
	{
		contractAddress: z.string(),
		functionName: z.string(),
		abi: z.array(z.any()),
		args: z.array(z.string())
	},
	async (args, extra) => {
		const result = await callContractFunction(args.contractAddress, args.functionName, args.abi, args.args)
		return {
			content: [{ type: "text", text: `Contract function called with result: ${result}` }]
		}
	}
)

mcp.tool(
	"queryContractState",
	{
		contractAddress: z.string(),
		functionName: z.string(),
		abi: z.array(z.any()),
		args: z.array(z.string())
	},
	async (args, extra) => {
		const result = await queryContractState(args.contractAddress, args.functionName, args.abi, args.args)
		return {
			content: [{ type: "text", text: `Contract state queried with result: ${JSON.stringify(result)}` }]
		}
	}
)

mcp.tool(
	"getStatus",
	"Get the current status of the wallet and network",
	async (extra) => {
		const status = await getStatus()
		return {
			content: [{ type: "text", text: `Current status: ${JSON.stringify(status)}` }]
		}
	}
)
