import { useState, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner, Contract } from 'ethers';

interface WalletState {
  address: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
}

export const useEthers = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    provider: null,
    signer: null,
  });

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('No Ethereum provider found. Please install MetaMask or another Web3 wallet.');
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setWalletState({
        address,
        chainId: Number(network.chainId),
        provider,
        signer,
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletState({
            address: null,
            chainId: null,
            provider: null,
            signer: null,
          });
        } else {
          setWalletState(prev => ({ ...prev, address: accounts[0] }));
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setWalletState(prev => ({ ...prev, chainId: Number(chainId) }));
      });

      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      chainId: null,
      provider: null,
      signer: null,
    });
  }, []);

  // Change network
  const changeNetwork = useCallback(async (chainId: number) => {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found');
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
      return true;
    } catch (error) {
      console.error('Error changing network:', error);
      return false;
    }
  }, []);

  // Send transaction
  const sendTransaction = useCallback(async (to: string, value: string, data?: string) => {
    try {
      if (!walletState.signer) throw new Error('No signer available');
      
      const tx = await walletState.signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
        data: data || '0x',
      });
      
      return await tx.wait();
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }, [walletState.signer]);

  // Get contract instance
  const getContract = useCallback((address: string, abi: any) => {
    if (!walletState.signer) throw new Error('No signer available');
    return new Contract(address, abi, walletState.signer);
  }, [walletState.signer]);

  // Call contract function
  const callContractFunction = useCallback(async (
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[] = []
  ) => {
    try {
      const contract = getContract(contractAddress, abi);
      const result = await contract[functionName](...args);
      return result;
    } catch (error) {
      console.error('Error calling contract function:', error);
      throw error;
    }
  }, [getContract]);

  // Query contract state
  const queryContractState = useCallback(async (
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[] = []
  ) => {
    try {
      const contract = getContract(contractAddress, abi);
      const result = await contract[functionName](...args);
      return result;
    } catch (error) {
      console.error('Error querying contract state:', error);
      throw error;
    }
  }, [getContract]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    changeNetwork,
    sendTransaction,
    callContractFunction,
    queryContractState,
  };
}; 