

const express = require('express');
const http = require('http');
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socket(server, { cors: { origin: "*" } });

let currentUsers = []

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("name", (data) => {
    currentUsers.push({ id: socket.id, name: data })
    console.log(data, "entered their name")
    io.emit("users", currentUsers)
  })

  socket.on('disconnect', () => {
    let index  = currentUsers.findIndex(el => el.id === socket.id)
    console.log(currentUsers[index]?.name, "disconnected")
    currentUsers.splice(index, 1)
    io.emit("users", currentUsers)
  })

  socket.on("stream", (data) => {
    socket.broadcast.emit("stream", data)
  })
});




const PORT = 8181;

server.listen(PORT, () => console.log("Listening"));