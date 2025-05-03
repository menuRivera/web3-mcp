import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { mcp } from "./src/mcp";
import { io, httpServer } from "./src/websocket";

const PORT = 65001;

// Start MCP server
const transport = new StdioServerTransport();
await mcp.connect(transport);

// Start Socket.IO server
httpServer.listen(PORT, () => { });
