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
const NODE_ENV = process.env.NODE_ENV || 'development';

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

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// IMPROVED CORS Configuration - Works for both dev and production
const allowedOrigins = [
  // 'http://localhost:5173',           // Vite dev
  // 'http://localhost:3000',           // React dev
  // 'http://localhost:5174', // Alternative port
  'https://www.admin.clustorix.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable preflight for all routes

// Request logger middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// --- Connect to DB and Start Server ---
connectDB().then(() => {
  // --- Routes ---
  const authRoutes = require("./routes/authRoutes");
  const schoolRoutes = require("./routes/schoolRoutes");
  const studentRoutes = require("./routes/studentRoutes");
  const teacherRoutes = require("./routes/teacherRoutes");

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/schools", schoolRoutes);
  app.use("/api/v1/students", studentRoutes);
  app.use("/api/v1/teachers", teacherRoutes);
  
  // Health check endpoint
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Clustorix Admin Portal Backend API is running",
      environment: NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // API status endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // --- Global Error Handler ---
  app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
    
    // Handle CORS errors
    if (err.message.includes('CORS')) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }
    
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`
    });
  });

  app.listen(PORT, () => {
    console.log('\n🚀 ================================');
    console.log(`   Server running on port ${PORT}`);
    console.log(`   Environment: ${NODE_ENV}`);
    console.log('================================');
    console.log('\n📍 API Endpoints:');
    console.log(`   Health: GET http://localhost:${PORT}/api/health`);
    console.log(`   Init Admin: GET http://localhost:${PORT}/api/v1/auth/init`);
    console.log(`   Login: POST http://localhost:${PORT}/api/v1/auth/login`);
    console.log(`   Schools: GET http://localhost:${PORT}/api/v1/schools`);
    console.log(`   Students: GET http://localhost:${PORT}/api/v1/students`);
    console.log('\n');
  });
});