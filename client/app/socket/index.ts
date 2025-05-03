// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('ws://localhost:65001', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('🟢 Socket conectado');
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket desconectado');
    });
  }

  return socket;
};