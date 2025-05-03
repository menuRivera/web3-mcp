"use client";

import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return;

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Por favor instala MetaMask");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
    } catch (error) {
      console.error("Error al conectar wallet:", error);
    }
  };

  return (
    <div className="p-4">
      {walletAddress ? (
        <p className="text-green-600">✅ Wallet conectada: {walletAddress}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Conectar Wallet
        </button>
      )}
    </div>
  );
}