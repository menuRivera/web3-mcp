import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { mcp } from "./mcp";
import { io } from "./websocket";

const PORT = 65001

const transport = new StdioServerTransport();
await mcp.connect(transport)
console.log('MCP server running...')

io.listen(PORT);
console.log(`WebSocket listening on port ${PORT}`)
