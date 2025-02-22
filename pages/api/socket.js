"use server";
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Socket is initializing");
  const io = new Server(res.socket.server, {
    cors: {
      origin: ["http://localhost:3000", "https://open-talk-six.vercel.app"],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("send-message", (data) => {
      io.emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  res.end();
}
