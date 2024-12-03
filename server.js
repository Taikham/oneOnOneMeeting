require('dotenv').config()
const express = require("express");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const teamRoutes = require("./routes/teamRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// ตรวจสอบ Environment Variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1);
}

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1); // ปิดโปรแกรมหากไม่สามารถเชื่อมต่อ
});

// Middleware
app.use(express.json());

// Routes
app.use("/api/oauth", authRoutes);
app.use("/api/book", authMiddleware, bookingRoutes);
app.use("/api/team-members", teamRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling Middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));