import express from "express";
import Booking from "../models/Booking.models.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Validation middleware
const validateBooking = [
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("email").isEmail().trim().withMessage("Valid email is required"),
  body("phone")
    .matches(/^[\d-+() ]{10,15}$/)
    .withMessage("Please enter a valid phone number"),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("message").notEmpty().trim().withMessage("Message is required"),
  body("venue").notEmpty().trim().withMessage("Venue is required"),
  body("lastdate").optional().trim(),
  body("status").optional().isIn(['pending', 'approved', 'rejected', 'cancelled'])
];

// Error handling middleware
const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create new booking
router.post("/api/booking", validateBooking, handleErrors, async (req, res) => {
  try {
    // Check for existing booking
    const existingBooking = await Booking.findOne({
      venue: req.body.venue,
      date: req.body.date,
      time: req.body.time,
      status: { $nin: ['cancelled', 'rejected'] }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This venue is already booked for the selected date and time"
      });
    }

    const newBooking = new Booking({
      ...req.body,
      status: "pending"
    });

    await newBooking.save();
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings with optional filters
router.get("/api/booking", async (req, res) => {
  try {
    const { status, venue, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (venue) filter.venue = venue;
    if (date) filter.date = date;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking by ID
router.get("/api/booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({
      message: "Booking retrieved successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking
router.put("/api/booking/:id", validateBooking, handleErrors, async (req, res) => {
  try {
    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
      _id: { $ne: req.params.id },
      venue: req.body.venue,
      date: req.body.date,
      time: req.body.time,
      status: { $nin: ['cancelled', 'rejected'] }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This venue is already booked for the selected date and time"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch("/api/booking/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete booking
router.delete("/api/booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ 
      message: "Booking deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;