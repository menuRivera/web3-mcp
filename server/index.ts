import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export const server = new McpServer({
	name: "web3-mcp-server",
	version: "1.0.0"
});

server.tool(
	"add",
	{ a: z.number(), b: z.number() },
	async ({ a, b }) => ({
		content: [{ type: "text", text: String(a + b) }]
	}),
);

server.resource(
	"greeting",
	new ResourceTemplate("greeting://{name}", { list: undefined }),
	async (uri, { name }) => ({
		contents: [{
			uri: uri.href,
			text: `Hello, ${name}!`
		}]
	})
);

server.tool(
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

const transport = new StdioServerTransport();
await server.connect(transport)


console.log('MCP server running...')
