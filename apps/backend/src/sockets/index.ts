import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { pollRoom, SOCKET_EVENTS } from "./socket-events";

let ioInstance: Server | null = null;

export function getSocketServer() {
  return ioInstance;
}

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(socket.request.headers),
    });

    socket.data.auth = session;
    next();
  });

  io.on("connection", (socket) => {
    socket.on(SOCKET_EVENTS.JOIN_POLL, (pollId: string) => {
      if (typeof pollId === "string" && pollId.length > 0) {
        socket.join(pollRoom(pollId));
      }
    });

    socket.on(SOCKET_EVENTS.LEAVE_POLL, (pollId: string) => {
      if (typeof pollId === "string" && pollId.length > 0) {
        socket.leave(pollRoom(pollId));
      }
    });
  });

  ioInstance = io;
  return io;
}
