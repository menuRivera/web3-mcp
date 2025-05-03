import type { IChainResource } from "../types/resources.type";

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
            name: "Matic",
            symbol: "MATIC",
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
    }
}; 
