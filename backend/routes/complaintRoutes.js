const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ─── MULTER CONFIG ────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|mov/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    ext && mime ? cb(null, true) : cb(new Error("Only images/videos allowed"));
  },
});

// ─── FILE COMPLAINT ───────────────────────────────────────
// POST /api/complaints
router.post("/", authMiddleware, upload.array("photos", 5), async (req, res) => {
  try {
    const { title, description, category, priority, ward, address, lat, lng, isAnonymous } = req.body;

    const photoUrls = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      category,
      priority: priority || "medium",
      ward,
      address,
      location: { lat: parseFloat(lat) || null, lng: parseFloat(lng) || null },
      photos: photoUrls,
      isAnonymous: isAnonymous === "true",
    });

    // Give user points for filing
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 10, complaintsfiled: 1 },
    });

    res.status(201).json({
      message: "Complaint filed successfully!",
      complaintId: complaint.complaintId,
      complaint,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET ALL COMPLAINTS (public) ─────────────────────────
// GET /api/complaints?category=&status=&priority=&page=1
router.get("/", async (req, res) => {
  try {
    const { category, status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate("user", "name area")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, page: Number(page), complaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET STATS ────────────────────────────────────────────
// GET /api/complaints/stats
router.get("/stats", async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const pending = await Complaint.countDocuments({ status: "pending" });
    const inProgress = await Complaint.countDocuments({ status: "in-progress" });
    const highPriority = await Complaint.countDocuments({ priority: "high", status: { $ne: "resolved" } });

    const categoryStats = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({ total, resolved, pending, inProgress, highPriority, categoryStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET MAP PINS ─────────────────────────────────────────
// GET /api/complaints/map
router.get("/map", async (req, res) => {
  try {
    const pins = await Complaint.find({ "location.lat": { $exists: true } })
      .select("title category status priority location complaintId")
      .limit(200);
    res.json(pins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── TRACK BY ID ──────────────────────────────────────────
// GET /api/complaints/track/:complaintId
router.get("/track/:complaintId", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId })
      .populate("user", "name area");

    if (!complaint) return res.status(404).json({ message: "Complaint not found." });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── UPVOTE ───────────────────────────────────────────────
// POST /api/complaints/:id/upvote
router.post("/:id/upvote", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Not found." });

    const alreadyVoted = complaint.upvotedBy.includes(req.user.id);
    if (alreadyVoted) {
      complaint.upvotedBy.pull(req.user.id);
      complaint.upvotes -= 1;
    } else {
      complaint.upvotedBy.push(req.user.id);
      complaint.upvotes += 1;
    }
    await complaint.save();
    res.json({ upvotes: complaint.upvotes, voted: !alreadyVoted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── RATE COMPLAINT ───────────────────────────────────────
// POST /api/complaints/:id/rate
router.post("/:id/rate", authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true }
    );
    // Give bonus points for rating
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 5 } });
    res.json({ message: "Rating saved!", complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── UPDATE STATUS (officer/admin only) ──────────────────
// PATCH /api/complaints/:id/status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (!["officer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    const { status, officerNotes, timelineNote } = req.body;
    const update = { status, officerNotes };
    if (status === "resolved") update.resolvedAt = new Date();

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true });

    if (timelineNote) {
      complaint.timeline.push({
        title: `Status → ${status}`,
        description: timelineNote,
        updatedBy: req.user.name,
      });
      await complaint.save();

      // Give user points when resolved
      if (status === "resolved") {
        await User.findByIdAndUpdate(complaint.user, { $inc: { points: 20 } });
      }
    }

    res.json({ message: "Status updated!", complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── MY COMPLAINTS ────────────────────────────────────────
// GET /api/complaints/mine
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
