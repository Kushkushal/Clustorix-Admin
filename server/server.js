require("dotenv").config();

// Add these debug lines immediately after dotenv
console.log("=== Environment Variables Check ===");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ MISSING!");
console.log("DEFAULT_ADMIN_EMAIL:", process.env.DEFAULT_ADMIN_EMAIL || "❌ MISSING!");
console.log("DEFAULT_ADMIN_PASSWORD:", process.env.DEFAULT_ADMIN_PASSWORD ? "✅ Set" : "❌ MISSING!");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ MISSING!");
console.log("===================================\n");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// --- Configuration ---
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// --- App Initialization ---
const app = express();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'https://clustorix-admin-frontend.onrender.com',
  credentials: true,
}));


// --- Connect to DB and Start Server ---
connectDB().then(() => {
  // --- Routes ---
  const authRoutes = require("./routes/authRoutes");
  const schoolRoutes = require("./routes/schoolRoutes");
  const studentRoutes = require("./routes/studentRoutes"); // ADD THIS LINE

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/schools", schoolRoutes);
  app.use("/api/v1/students", studentRoutes); // ADD THIS LINE
  
  app.get("/", (req, res) => {
    res.send("Clustorix Admin Portal Backend API is running.");
  });

  // --- Global Error Handler ---
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`Default Admin Init: GET http://localhost:${PORT}/api/v1/auth/init`);
    console.log(`Default Admin Login: POST http://localhost:${PORT}/api/v1/auth/login`);
    console.log(`Students API: GET http://localhost:${PORT}/api/v1/students`); // ADD THIS LINE
  });
});