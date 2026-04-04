const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── ROUTES ───────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

// ─── HEALTH CHECK ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "CivicPulse API running ✅", time: new Date() });
});

// ─── CONNECT DB & START ───────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
