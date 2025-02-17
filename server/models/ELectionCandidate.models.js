import mongoose from "mongoose";

const ElectionCandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    scorecard: {
      type: String, // Stores the URL of the uploaded scorecard
      default: "",
      required: true,
    },
    image: {
      type: String, // Stores the URL of the profile image
      required: true,
    },
    status: {
      type: String,
      default: "pending", // Initial status is "pending"
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ElectionCandidate", ElectionCandidateSchema);
