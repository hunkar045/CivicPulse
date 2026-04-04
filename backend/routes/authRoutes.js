const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to sign JWT
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ─── REGISTER ─────────────────────────────────────────────
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, area } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered." });

    const user = await User.create({ name, email, phone, password, area });
    const token = signToken(user);

    res.status(201).json({
      message: "Registered successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, points: user.points },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── LOGIN ────────────────────────────────────────────────
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Incorrect password." });

    const token = signToken(user);

    res.json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, points: user.points },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET PROFILE ──────────────────────────────────────────
// GET /api/auth/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── LEADERBOARD ──────────────────────────────────────────
// GET /api/auth/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .select("name area points complaintsfiled")
      .sort({ points: -1 })
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
