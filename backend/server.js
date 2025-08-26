const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const socketIo = require("socket.io");

// Load env vars based on environment
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./config.production.env" });
} else {
  dotenv.config({ path: "./config.env" });
}

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL, "https://your-domain.com"] // Replace with your actual domain
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5174",
        ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL, "https://your-domain.com"] // Replace with your actual domain
        : [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
          ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Socket.IO connection handling
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their user ID
  socket.on("join", (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined`);
  });

  // Handle private messages
  socket.on("private message", (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new message", message);
    }
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    const { receiverId, isTyping } = data;
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user typing", {
        userId: socket.userId,
        isTyping,
      });
    }
  });

  // Handle read receipts
  socket.on("message read", (data) => {
    const { senderId } = data;
    const senderSocketId = connectedUsers.get(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("message read by", socket.userId);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Customer Chat API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint for hosting providers
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
});
