import mongoose from "mongoose";

const VALID_YEARS = ["second", "third", "last"];
const VALID_BRANCHES = ["CSE", "EXTC", "IT", "PROD", "MECH", "TEXT", "CIVIL", "ELECT", "INSTRU", "CHEM"];
const VALID_POSITIONS = ["Technical Secretary", "General Secretary", "Sport Secretary", "Cultural Secretary", "Girls Representative"];
const VALID_STATUSES = ["pending", "approved", "rejected"];

const ElectionCandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
  },
  regNo: {
    type: String,
    required: [true, "Registration number is required"],
    unique: true,
    trim: true,
  },
  year: {
    type: String,
    required: [true, "Academic year is required"],
    enum: {
      values: VALID_YEARS,
      message: "{VALUE} is not a valid academic year"
    }
  },
  branch: {
    type: String,
    required: [true, "Branch is required"],
    enum: {
      values: VALID_BRANCHES,
      message: "{VALUE} is not a valid branch"
    }
  },
  position: {
    type: String,
    required: [true, "Position is required"],
    enum: {
      values: VALID_POSITIONS,
      message: "{VALUE} is not a valid position"
    }
  },
  scorecard: {
    type: String,
    required: [true, "Scorecard URL is required"]
  },
  image: {
    type: String,
    required: [true, "Profile image URL is required"]
  },
  status: {
    type: String,
    enum: {
      values: VALID_STATUSES,
      message: "{VALUE} is not a valid status"
    },
    default: "pending"
  },
  votes: {
    type: Number,
    default: 0
  
  }
}, { 
  timestamps: true 
});


export const validationConstants = {
  VALID_YEARS,
  VALID_BRANCHES,
  VALID_POSITIONS,
  VALID_STATUSES
};

export default mongoose.model("ElectionCandidate", ElectionCandidateSchema);
