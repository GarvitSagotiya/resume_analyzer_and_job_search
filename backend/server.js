const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // CRITICAL: Parses HttpOnly cookies
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

dotenv.config();

const app = express();

// ====================================
// Database Connection
// ====================================
connectDB();

// ====================================
// Middleware Configuration
// ====================================

// CORS must allow credentials so HttpOnly cookies can be sent and stored by Vite
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Missing this will throw "Cannot read properties of undefined (reading 'jwt')" inside controller
app.use(cookieParser());

// ====================================
// Root & Test Routes
// ====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running Successfully",
  });
});

app.post("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TEST ROUTE WORKING",
  });
});

// ====================================
// API Routes Mapping
// ====================================

// User & Auth Routes (Maps to /api/users/register, /api/users/login, etc.)
app.use("/api/users", userRoutes);

// Resume Routes
app.use("/api/resume", resumeRoutes);

// ====================================
// 404 Route Handler
// ====================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ====================================
// Server Initialization
// ====================================
const PORT = process.env.PORT || 7300;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});