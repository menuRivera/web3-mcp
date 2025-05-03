import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { connectWallet, disconnectWallet } from "../websocket/actions";

// create mcp server and setup tools and resources

export const mcp = new McpServer({
	name: "web3-mcp-server",
	version: "1.0.0"
});

mcp.tool(
	"connectWallet",
	async () => {
		const success = await connectWallet()
		return {
			content: [{ type: "text", text: `Wallet connected: ${success}` }]
		}
	},
)

mcp.tool(
	"disconnectWallet",
	async () => {
		const success = await disconnectWallet()
		return {
			content: [{ type: "text", text: `Wallet connected: ${success}` }]
		}
	},
)
