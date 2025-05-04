# Web3 MCP: Interact with Blockchain Using Natural Language

## Purpose

Web3 MCP lets you use natural language commands (through an MCP client like Claude Desktop) to interact with blockchain, without needing to directly handle private keys or understand complex blockchain details. Your web3 wallet (like MetaMask) securely manages your keys through a web application.

## Quickstart

1.  **Install MCP Server:** Download the correct binary for your computer from the [Releases](https://github.com/menuRivera/web3-mcp/releases) page and run it.
2.  **Configure MCP Client:** Set up your MCP client (e.g., Claude Desktop) to connect to the MCP server address and port. Define tools for blockchain actions.
### Examples
```json 
{
  "mcpServers": {
    "web3-mcp": {
      "command": "/home/manuel/web3-mcp/dist/web3-mcp-linux", (for linux)
      "command": "C:\\Path\\To\\web3-mcp.exe" (for windows)
    }
  }
}
```

3.  **Open Web App:** Go to [web3-mcp.vercel.app](https://web3-mcp.vercel.app) in your browser. 
4.  **Use Natural Language:** In your MCP client, use natural language commands (as per your configured tools) to perform blockchain actions (e.g., connect wallet, send tokens, query data, call contracts). The results will be shown in your MCP client and signatures requests will be managed by your browser wallet extension.

## Disclaimer

* Run the MCP server only on your local machine.
* Trust the web application before connecting your wallet.
* Carefully configure your MCP client tools.
