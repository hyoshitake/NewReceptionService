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

app.get("/reserve", (req, res) => {
  res.sendFile(__dirname + "/reserve.html");
});

// socket.ioの接続設定
io.on("connection", (socket) => {
  // 接続があったときの処理
  socket.on("join", (msg) => {
    console.log('received join:' + msg.roomCode);
    socket.join(msg.roomCode);
  })

  // 受付があったときの処理
  socket.on("post", (msg) => {
    console.log('received:');
    io.to(msg.roomCode).emit("reserve");
    console.log('broadcasted reserve:');
  });
});

httpServer.listen(3000);
