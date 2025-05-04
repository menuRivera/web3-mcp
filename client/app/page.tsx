"use client"

import styles from "./page.module.css";
import { useSocket } from "./hooks/useSocket";
import Image from "next/image";

export default function Home() {
	useSocket();

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<div className={styles.content}>
					<div className={styles.logoContainer}>
						<Image
							src="/logo.png"
							alt="Web3 Wallet Bridge Logo"
							width={180}
							height={180}
							priority
							className={styles.logo}
						/>
					</div>
					<h1 className={styles.title}>Web3 Wallet Bridge</h1>
					<p className={styles.message}>
						Your gateway to seamless Web3 interactions. This bridge enables natural language communication with your wallet, making blockchain interactions more intuitive and accessible. Please keep this window open to maintain the connection with your wallet.
					</p>
				</div>
			</main>
		</div>
	);
}
