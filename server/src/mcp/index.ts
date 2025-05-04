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
import type { INetwork } from "@shared/network.type";
import type { IStatus } from "@shared/status.type";
import { z } from "zod";
import { chains } from "../config/chains";
import type { IContractResource } from "@shared/resources.type";

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
	async () => {
		const res = await connectWallet()
		return {
			content: [{ type: "text", text: `Wallet connected: ${res.success}` }]
		}
	},
)

mcp.tool(
	"disconnectWallet",
	async () => {
		const success = await disconnectWallet()
		return {
			content: [{ type: "text", text: `Wallet disconnected: ${success}` }]
		}
	},
)
