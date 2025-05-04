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
    },
    "optimism": {
        name: "Optimism",
        chainId: 10,
        currency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://mainnet.optimism.io"],
        blockExplorerUrls: ["https://optimistic.etherscan.io"]
    },
    "base": {
        name: "Base",
        chainId: 8453,
        currency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://mainnet.base.org"],
        blockExplorerUrls: ["https://basescan.org"]
    },
    "bsc": {
        name: "BNB Smart Chain",
        chainId: 56,
        currency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18
        },
        rpcUrls: ["https://bsc-dataseed.binance.org"],
        blockExplorerUrls: ["https://bscscan.com"]
    },
    "avalanche": {
        name: "Avalanche C-Chain",
        chainId: 43114,
        currency: {
            name: "Avalanche",
            symbol: "AVAX",
            decimals: 18
        },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io"]
    },
    "fantom": {
        name: "Fantom Opera",
        chainId: 250,
        currency: {
            name: "Fantom",
            symbol: "FTM",
            decimals: 18
        },
        rpcUrls: ["https://rpc.ftm.tools"],
        blockExplorerUrls: ["https://ftmscan.com"]
    },
    "gnosis": {
        name: "Gnosis Chain",
        chainId: 100,
        currency: {
            name: "xDAI",
            symbol: "xDAI",
            decimals: 18
        },
        rpcUrls: ["https://rpc.gnosischain.com"],
        blockExplorerUrls: ["https://gnosisscan.io"]
    },
    "celo": {
        name: "Celo",
        chainId: 42220,
        currency: {
            name: "Celo",
            symbol: "CELO",
            decimals: 18
        },
        rpcUrls: ["https://forno.celo.org"],
        blockExplorerUrls: ["https://explorer.celo.org"]
    },
    "soneium": {
        name: "Soneium",
        chainId: 1868,
        currency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://rpc.soneium.org/"],
        blockExplorerUrls: []
    }
}; 
