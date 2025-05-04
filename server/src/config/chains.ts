import type { IChainResource } from "@shared/resources.type";

export const chains: Record<string, IChainResource> = {
    "ethereum": {
        name: "Ethereum",
        chainId: 1,
        currency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        blockExplorerUrls: ["https://etherscan.io"]
    },
    "polygon": {
        name: "Polygon",
        chainId: 137,
        currency: {
            name: "POL",
            symbol: "POL",
            decimals: 18
        },
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com"]
    },
    "arbitrum": {
        name: "Arbitrum One",
        chainId: 42161,
        currency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"]
    },
    "arbitrum-sepolia": {
        name: "Arbitrum Sepolia",
        chainId: 421614,
        currency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://sepolia.arbiscan.io"]
    }
}; 
