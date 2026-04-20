const fs = require('fs');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://docs.google.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/reception", (req, res) => {
  res.sendFile(__dirname + "/reception.html");
});

// socket.ioの接続設定
io.on("connection", (socket) => {
  // 接続があったときの処理
  socket.on("join", (msg) => {
    console.log('received join:' + msg.roomCode);
    socket.join(msg.roomCode);
  })

  // 受付があったときの処理
  socket.on("post", (receptionData) => {
    console.log('received:', receptionData);
    io.to(receptionData.roomCode).emit("reception", { name: receptionData.name || "〇○" });
    console.log('broadcasted reception:', receptionData.roomCode, receptionData.name);
  });
});

httpServer.listen(3000);
