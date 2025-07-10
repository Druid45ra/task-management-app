const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("updateTask", (task) => {
    io.emit("taskUpdated", task);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = io;
