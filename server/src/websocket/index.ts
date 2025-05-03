import { Server } from "socket.io";
import type { IMessageToServer } from "../types/messageToServer.type";

export const io = new Server({
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	}
});

io.on("connection", (socket) => {
	console.log(`Socket connected ${socket.id}`)

	socket.on('messageToServer', async (msg: IMessageToServer) => {
		console.log(msg)
	})

	// attach event listeners
});
