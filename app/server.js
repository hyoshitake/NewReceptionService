const path = require("path");
const util = require("util");
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

const MAX_LOG_ENTRIES = 200;
const logEntries = [];
const originalConsoleLog = console.log.bind(console);
const originalConsoleError = console.error.bind(console);

function addLogEntry(level, args) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: util.formatWithOptions({ colors: false }, ...args)
  };

  logEntries.push(entry);
  if (logEntries.length > MAX_LOG_ENTRIES) {
    logEntries.shift();
  }

  io.emit("server-log", entry);
}

console.log = (...args) => {
  originalConsoleLog(...args);
  addLogEntry("log", args);
};

console.error = (...args) => {
  originalConsoleError(...args);
  addLogEntry("error", args);
};

app.get("/reception", (req, res) => {
  res.sendFile(path.join(__dirname, "reception.html"));
});

app.get("/log", (req, res) => {
  res.sendFile(path.join(__dirname, "log.html"));
});

// socket.ioの接続設定
io.on("connection", (socket) => {
  socket.emit("log:init", logEntries);
  console.log("socket connected:", socket.id);

  // 接続があったときの処理
  socket.on("join", (msg) => {
    console.log("received join:" + msg.roomCode);
    socket.join(msg.roomCode);
  });

  // 受付があったときの処理
  socket.on("post", (receptionData) => {
    console.log("received:", receptionData);
    io.to(receptionData.roomCode).emit("reception", { name: receptionData.name || "〇○" });
    console.log("broadcasted reception:", receptionData.roomCode, receptionData.name);
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", socket.id, reason);
  });
});

httpServer.listen(3000, () => {
  console.log("server listening on port 3000");
});
