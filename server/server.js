// server.js
require("dotenv").config();

// Environment variables check
console.log("=== Environment Variables Check ===");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ MISSING!");
console.log("DEFAULT_ADMIN_EMAIL:", process.env.DEFAULT_ADMIN_EMAIL || "❌ MISSING!");
console.log("DEFAULT_ADMIN_PASSWORD:", process.env.DEFAULT_ADMIN_PASSWORD ? "✅ Set" : "❌ MISSING!");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ MISSING!");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("===================================\n");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// --- Configuration ---
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// --- App Initialization ---
const app = express();

// If you use cookies with SameSite=None on Render/behind proxy
app.set("trust proxy", 1);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * ✅ Robust CORS for prod & dev
 * - Allows exact known origins
 * - Allows ANY subdomain of clustorix.com (e.g., preview/admin variants)
 * - Never throws; returns options so preflight always responds cleanly
 */
const allowedExact = new Set([
  "https://admin.clustorix.com",
  "https://www.admin.clustorix.com",
  // Uncomment for local dev:
  // "http://localhost:5173",
  // "http://localhost:3000",
  // "http://localhost:5174",
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // server-to-server/Postman
  try {
    const u = new URL(origin);
    const host = u.hostname;
    if (allowedExact.has(u.origin)) return true;
    // allow any subdomain of clustorix.com (and apex)
    if (host === "clustorix.com" || host.endsWith(".clustorix.com")) return true;
  } catch (_) {
    // malformed Origin header -> deny
  }
  return false;
};

// Build CORS options per request
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");
  const allowed = isAllowedOrigin(origin);
  const options = {
    origin: allowed,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204, // for legacy browsers
  };
  // Never pass an Error here — let browser handle if origin not allowed
  callback(null, options);
};

// Apply BEFORE routes and error handlers
app.use(cors(corsOptionsDelegate));
// Ensure all preflights are handled early
app.options("*", cors(corsOptionsDelegate));

// Request logger (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || "none"}`);
  next();
});

// --- Connect to DB and Start Server ---
connectDB().then(() => {
  // --- Routes ---
  const authRoutes = require("./routes/authRoutes");
  const schoolRoutes = require("./routes/schoolRoutes");
  const studentRoutes = require("./routes/studentRoutes");
  const teacherRoutes = require("./routes/teacherRoutes");
  const statsRoutes = require("./routes/statsRoutes");
  const feesRoutes = require('./routes/feesRoutes');
  const attendanceRoutes = require('./routes/attendanceRoutes');
  const classRoutes = require('./routes/classRoutes');
  const subjectRoutes = require('./routes/subjectRoutes');

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/schools", schoolRoutes);
  app.use("/api/v1/students", studentRoutes);
  app.use("/api/v1/teachers", teacherRoutes);
  app.use("/api/v1/stats", statsRoutes);
  app.use("/api/v1/fees", feesRoutes);
  app.use("/api/v1/attendances", attendanceRoutes);
  app.use("/api/v1/classes", classRoutes);
  app.use("/api/v1/subjects", subjectRoutes);

  // Health check
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Clustorix Admin Portal Backend API is running",
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // API status
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // --- Global Error Handler ---
  app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    console.error("Stack:", err.stack);
    // Do NOT manufacture custom CORS errors or throw here; just return JSON
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(NODE_ENV === "development" && { stack: err.stack }),
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  app.listen(PORT, () => {
    console.log("\n🚀 ================================");
    console.log(`   Server running on port ${PORT}`);
    console.log(`   Environment: ${NODE_ENV}`);
    console.log("================================");
    console.log("\n📍 API Endpoints:");
    console.log(`   Health: GET http://localhost:${PORT}/api/health`);
    console.log(`   Init Admin: GET http://localhost:${PORT}/api/v1/auth/init`);
    console.log(`   Login: POST http://localhost:${PORT}/api/v1/auth/login`);
    console.log(`   Schools: GET http://localhost:${PORT}/api/v1/schools`);
    console.log(`   Students: GET http://localhost:${PORT}/api/v1/students`);
    console.log("\n");
  });
});
