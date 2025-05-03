"use client"

import Image from "next/image";
import styles from "./page.module.css";
import ConnectWallet from "./components/connectWallet";
import WalletConnector from "./components/SocketProvider";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
       <h1>Keep the windows open, please</h1>
       <ConnectWallet></ConnectWallet>
       <WalletConnector></WalletConnector>
      </main>
      <footer className={styles.footer}>
       
      </footer>
    </div>
  );
}
