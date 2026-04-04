const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Water Supply",
        "Roads & Potholes",
        "Electricity",
        "Garbage & Sanitation",
        "Sewage & Drainage",
        "Street Lighting",
        "Public Transport",
        "Parks & Recreation",
        "Noise Pollution",
        "Air Pollution",
        "Building Violations",
        "Traffic Signal",
        "Healthcare",
        "Public Property Damage",
        "Stray Animals",
        "Trees & Greenery",
        "Encroachment",
        "Corruption",
        "Other",
      ],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },
    ward: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    photos: [{ type: String }],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    timeline: [
      {
        title: String,
        description: String,
        date: { type: Date, default: Date.now },
        updatedBy: String,
      },
    ],
    assignedOfficer: {
      type: String,
      default: "",
    },
    officerNotes: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-generate complaint ID before saving
complaintSchema.pre("save", async function (next) {
  if (!this.complaintId) {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    this.complaintId = `CP-${year}-${random}`;

    // Push initial timeline entry
    this.timeline.push({
      title: "Complaint Filed",
      description: "Your complaint has been received and registered.",
      updatedBy: "System",
    });
  }
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);
