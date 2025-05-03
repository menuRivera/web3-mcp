import { Server } from "socket.io";

export const io = new Server();

io.on("connection", (socket) => {
	console.log(`Socket connected ${socket.id}`)
	// attach event listeners
});
