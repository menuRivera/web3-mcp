import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// create mcp server and setup tools and resources

export const mcp = new McpServer({
	name: "web3-mcp-server",
	version: "1.0.0"
});

mcp.tool(
	"add",
	{ a: z.number(), b: z.number() },
	async ({ a, b }) => ({
		content: [{ type: "text", text: String(a + b) }]
	}),
);

mcp.resource(
	"greeting",
	new ResourceTemplate("greeting://{name}", { list: undefined }),
	async (uri, { name }) => ({
		contents: [{
			uri: uri.href,
			text: `Hello, ${name}!`
		}]
	})
);

mcp.tool(
	'multiply two numbers',
	{ a: z.number(), b: z.number(), },
	async ({ a, b }) => {
		return {
			content: [{
				type: 'text',
				text: String(a * b)
			}]
		}
	}
)

