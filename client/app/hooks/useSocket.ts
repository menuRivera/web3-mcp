import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useEthers } from './useEthers';
import { ICallbackParams } from '../types/callback.type';
import { IStatus } from '../types/status.type';
import { INetwork } from '../types/network.type';

const SOCKET_URL = 'ws://localhost:65001';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { 
    connectWallet, 
    disconnectWallet, 
    changeNetwork,
    sendTransaction,
    callContractFunction,
    queryContractState,
    address,
    chainId,
    provider
  } = useEthers();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    // Listen for connect event
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });

    // Listen for walletConnect event
    socketRef.current.on('connectWallet', async (callback: ICallbackParams<IStatus>) => {
      try {
        const success = await connectWallet();
        if (success && provider) {
          const network = await provider.getNetwork();
          const accounts = await provider.listAccounts();
          
          callback({
            success: true,
            data: {
              activeAccount: address || '',
              accounts: accounts.map(account => account.address),
              network: {
                chainId: Number(network.chainId),
                name: network.name,
                currency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                }
              }
            }
          });
        } else {
          callback({
            success: false,
            data: {
              activeAccount: '',
              accounts: [],
              network: {
                chainId: 0,
                name: '',
                currency: {
                  name: '',
                  symbol: '',
                  decimals: 0
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error in connectWallet handler:', error);
        callback({
          success: false,
          data: {
            activeAccount: '',
            accounts: [],
            network: {
              chainId: 0,
              name: '',
              currency: {
                name: '',
                symbol: '',
                decimals: 0
              }
            }
          }
        });
      }
    });

    // Listen for disconnectWallet event
    socketRef.current.on('disconnectWallet', (callback: ICallbackParams<void>) => {
      try {
        disconnectWallet();
        callback({
          success: true,
          data: undefined
        });
      } catch (error) {
        console.error('Error in disconnectWallet handler:', error);
        callback({
          success: false,
          data: undefined
        });
      }
    });

    // Listen for getStatus event
    socketRef.current.on('getStatus', async (callback: ICallbackParams<IStatus>) => {
      try {
        if (!provider) {
          throw new Error('No provider available');
        }

        const network = await provider.getNetwork();
        const accounts = await provider.listAccounts();
        
        callback({
          success: true,
          data: {
            activeAccount: address || '',
            accounts: accounts.map(account => account.address),
            network: {
              chainId: Number(network.chainId),
              name: network.name,
              currency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18
              }
            }
          }
        });
      } catch (error) {
        console.error('Error in getStatus handler:', error);
        callback({
          success: false,
          data: {
            activeAccount: '',
            accounts: [],
            network: {
              chainId: 0,
              name: '',
              currency: {
                name: '',
                symbol: '',
                decimals: 0
              }
            }
          }
        });
      }
    });

    // Listen for changeNetwork event
    socketRef.current.on('changeNetwork', async (data: { chainId: number }, callback: ICallbackParams<INetwork>) => {
      try {
        const success = await changeNetwork(data.chainId);
        if (success && provider) {
          const network = await provider.getNetwork();
          callback({
            success: true,
            data: {
              chainId: Number(network.chainId),
              name: network.name,
              currency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18
              }
            }
          });
        } else {
          callback({
            success: false,
            data: {
              chainId: 0,
              name: '',
              currency: {
                name: '',
                symbol: '',
                decimals: 0
              }
            }
          });
        }
      } catch (error) {
        console.error('Error in changeNetwork handler:', error);
        callback({
          success: false,
          data: {
            chainId: 0,
            name: '',
            currency: {
              name: '',
              symbol: '',
              decimals: 0
            }
          }
        });
      }
    });

    // Listen for callContractFunction event
    socketRef.current.on('callContractFunction', async (
      data: { 
        address: string, 
        abi: any, 
        functionName: string, 
        args?: any[] 
      }, 
      callback: ICallbackParams<any>
    ) => {
      try {
        const result = await callContractFunction(
          data.address,
          data.abi,
          data.functionName,
          data.args
        );
        callback({
          success: true,
          data: result
        });
      } catch (error) {
        console.error('Error in callContractFunction handler:', error);
        callback({
          success: false,
          data: null
        });
      }
    });

    // Listen for queryContractState event
    socketRef.current.on('queryContractState', async (
      data: { 
        address: string, 
        abi: any, 
        functionName: string, 
        args?: any[] 
      }, 
      callback: ICallbackParams<any>
    ) => {
      try {
        const result = await queryContractState(
          data.address,
          data.abi,
          data.functionName,
          data.args
        );
        callback({
          success: true,
          data: result
        });
      } catch (error) {
        console.error('Error in queryContractState handler:', error);
        callback({
          success: false,
          data: null
        });
      }
    });

    // Listen for sendTransaction event
    socketRef.current.on('sendTransaction', async (
      data: { 
        to: string, 
        value: string, 
        data?: string 
      }, 
      callback: ICallbackParams<{ hash: string }>
    ) => {
      try {
        const receipt = await sendTransaction(data.to, data.value, data.data);
        if (!receipt) throw new Error('Transaction failed');
        
        callback({
          success: true,
          data: {
            hash: receipt.hash
          }
        });
      } catch (error) {
        console.error('Error in sendTransaction handler:', error);
        callback({
          success: false,
          data: { hash: '' }
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connectWallet, disconnectWallet, changeNetwork, sendTransaction, callContractFunction, queryContractState, address, chainId, provider]);

  return socketRef.current;
}; 