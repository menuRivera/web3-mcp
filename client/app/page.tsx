"use client"

import styles from "./page.module.css";
import { useSocket } from "./hooks/useSocket";

export default function Home() {
	useSocket();

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1>Keep the windows open, please</h1>
			</main>
			<footer className={styles.footer}>

			</footer>
		</div>
	);
}
