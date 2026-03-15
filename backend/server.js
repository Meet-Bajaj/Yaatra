require("dotenv").config();
require("./config/db");

const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const User = require("./models/users");
const app = express();

const setupSwagger = require("./swagger");

app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(express.json());

const http = require("http");
const { Server } = require("socket.io");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const { initializeSockets } = require("./sockets/location.socket");

// Initialize Swagger docs
setupSwagger(app);

app.use("/api/v1", require("./routes"));

app.get("/", (req, res) => {
  res.send("Welcome to RickRide API");
});

// Setup 404 and global error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Create HTTP server instead of listening directly on Express app
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Initialize socket namespaces
initializeSockets(io);

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});

