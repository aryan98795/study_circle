const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); // Bind socket.io to server

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Connection event
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for custom event
  socket.on('chat message', (msg) => {
    console.log('Message:', msg);

    // Send to all clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
