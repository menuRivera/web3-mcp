interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (...args: any[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  removeAllListeners: (eventName: string) => void;
  selectedAddress: string | null;
  networkVersion: string;
  chainId: string;
  isConnected: () => boolean;
  enable: () => Promise<string[]>;
}

declare global {
  interface Window {
    ethereum: EthereumProvider;
  }
}

export {}; 