import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { mcp } from "./src/mcp";
import { io } from "./src/websocket";

const PORT = 65001

const transport = new StdioServerTransport();
await mcp.connect(transport)
io.listen(PORT);
