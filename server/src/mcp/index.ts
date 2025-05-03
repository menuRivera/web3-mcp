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

// create mcp server and setup tools and resources
export const mcp = new McpServer({
	name: "web3-mcp-server",
	version: "1.0.0"
});

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
