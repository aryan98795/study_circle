const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongooseConnection = require("./config/mongoose");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const socketHandler = require('./utils/socketHandler');
const app = express();
const http = require("http");
const multer = require('multer');
const path = require('path');


const server = http.createServer(app);
const io = socketIO(server);

// Use Socket.IO in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});


socketHandler(io);
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);  
app.use("/api/blogs", blogRoutes);  
app.use("/api/users", userRoutes);  

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
