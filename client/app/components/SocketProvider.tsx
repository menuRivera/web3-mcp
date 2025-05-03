'use client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getSocket } from '../socket/index'; // Ajusta la ruta si es necesario

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Conectar a la wallet
  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts: string[] = await provider.send('eth_requestAccounts', []);
          setWalletAddress(accounts[0]);
        } catch (err) {
          console.error(err);
          setError('Error al conectar la wallet');
        }
      } else {
        setError('MetaMask no está instalada');
      }
    };

    connectWallet();
  }, []);

  // Enviar dirección al servidor vía WebSocket
  useEffect(() => {
    const socket = getSocket();

    if (walletAddress) {
      socket.emit('wallet_connected', { address: walletAddress });
    }

    socket.on('server_message', (data: string) => {
      console.log('📨 Mensaje del servidor:', data);
    });

    return () => {
      socket.off('server_message');
    };
  }, [walletAddress]);

  return (
    <div>
      {walletAddress ? (
        <p>✅ Wallet conectada: {walletAddress}</p>
      ) : (
        <p>🔄 Conectando a wallet...</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default WalletConnector;
