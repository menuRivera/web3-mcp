console.log("¡Script de contenido ejecutándose!");


interface Window {
    ethereum?: any; // Usamos 'any' para evitar problemas de tipo iniciales.
  }

window.addEventListener('load', () => {
  if (window.ethereum) {
    console.log("¡Billetera web3 detectada!");
    browser.runtime.sendMessage({ type: "WEB3_DETECTED" });

    // Opcional: Obtener la cuenta conectada inicialmente
    window.ethereum.request({ method: 'eth_accounts' })
      .then((accounts: string[]) => {
        if (accounts.length > 0) {
          console.log("Cuenta conectada:", accounts[0]);
          browser.runtime.sendMessage({ type: "WEB3_ACCOUNT_CHANGED", account: accounts[0] });
        }
      })
      .catch((error: any) => {
        console.error("Error al obtener cuentas iniciales:", error);
      });

    // Escuchar cambios de cuenta (cuando el usuario cambia de cuenta en MetaMask)
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) {
        console.log("Cuenta cambió a:", accounts[0]);
        browser.runtime.sendMessage({ type: "WEB3_ACCOUNT_CHANGED", account: accounts[0] });
      } else {
        console.log("No hay cuentas conectadas.");
        browser.runtime.sendMessage({ type: "WEB3_ACCOUNT_CHANGED", account: null });
      }
    });
  }
});