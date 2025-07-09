// src/services/socket.js
module.exports = (io) => {
    io.on("connection", (socket) => {
      console.log("A user connected");
  
      socket.on("joinGroup", (groupId) => {
        socket.join(groupId); // Join user to specific group room
        console.log(`User joined group ${groupId}`);
      });
  
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  };
  