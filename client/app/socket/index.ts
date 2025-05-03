/*import { io } from "socket.io-client";

export const socket = io("ws://localhost:65001");*/


const socket = new WebSocket("ws://localhost:65001"); 

socket.addEventListener("open", () => {
  console.log("🔌 Conectado al servidor MPC");

  // Ejemplo: enviar un mensaje de inicio
  const helloMessage = {
    type: "HELLO",
    payload: "Hola desde cliente TypeScript",
  };

  socket.send(JSON.stringify(helloMessage));
});

socket.addEventListener("message", (event) => {
  console.log("📨 Mensaje recibido del servidor MPC:", event.data);

  try {
    const data = JSON.parse(event.data);

    if (data.type === "SIGNATURE_RESULT") {
      console.log("✅ Firma recibida:", data.payload);
    }

    // Puedes manejar más tipos aquí...
  } catch (err) {
    console.error("❌ Error al parsear el mensaje:", err);
  }
});

socket.addEventListener("close", () => {
  console.log("🔌 Conexión WebSocket cerrada");
});

socket.addEventListener("error", (err) => {
  console.error("❗ WebSocket error:", err);
});

export default socket;