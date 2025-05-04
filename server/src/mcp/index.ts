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
import { io } from "../websocket";
import type { INetwork } from "@shared/network.type";
import type { IStatus } from "@shared/status.type";
import { z } from "zod";
import { chains } from "../config/chains";
import { contracts } from "../contracts/contracts";

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

mcp.tool(
	"getStatus",
	async () => {
		const socketId = io.sockets.sockets.keys().next().value;
		if (!socketId) {
			return {
				content: [{ 
					type: "text", 
					text: "No connected clients found" 
				}]
			};
		}
		const status = await getStatus(socketId);
		return {
			content: [{ 
				type: "text", 
				text: `Status:\nActive Account: ${status.activeAccount}\nNetwork: ${status.network.name} (Chain ID: ${status.network.chainId})\nBalance: ${status.balance.native} ${status.network.currency.symbol}`
			}]
		}
	},
)

mcp.tool(
	"changeNetwork",
	{ chainName: z.string() },
	async ({ chainName }, extra) => {
		// First get the chain from our chains object
		const chain = chains[chainName as keyof typeof chains];
		if (!chain) {
			return {
				isError: true,
				content: [{ type: "text", text: `Chain ${chainName} not found` }]
			};
		}

		// Perform the network change with all required chain information
		const success = await changeNetwork({
			chainId: chain.chainId,
			name: chain.name,
			currency: chain.currency,
			rpcUrls: chain.rpcUrls,
			blockExplorerUrls: chain.blockExplorerUrls
		});

		// Return both the chain object and the change result
		return {
			content: [
				{
					type: "resource",
					resource: {
						uri: `chains://${chainName}`,
						text: JSON.stringify(chain)
					}
				},
				{
					type: "text",
					text: `Network changed to ${chain.name}: ${success}`
				}
			]
		};
	}
);

mcp.tool(
	"sendTransaction",
	{
		to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
		amount: z.string().regex(/^\d+(\.\d+)?$/, "Invalid amount format")
	},
	async ({ to, amount }, extra) => {
		// Get the current network to get the currency decimals
		const socketId = io.sockets.sockets.keys().next().value;
		if (!socketId) {
			return {
				isError: true,
				content: [{ type: "text", text: "No connected clients found" }]
			};
		}

		const status = await getStatus(socketId);
		const decimals = status.network.currency.decimals;

		// Format the amount according to the currency decimals
		const formattedAmount = BigInt(Math.round(parseFloat(amount) * Math.pow(10, decimals))).toString();

		// Send the transaction
		const txHash = await sendTransaction(to, formattedAmount);

		return {
			content: [
				{
					type: "text",
					text: `Transaction sent to ${to} for ${amount} ${status.network.currency.symbol}`
				},
				{
					type: "text",
					text: `Transaction hash: ${txHash}`
				}
			]
		};
	}
);
