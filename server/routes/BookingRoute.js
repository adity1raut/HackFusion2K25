import express from "express";
import Booking from "../models/Booking.models";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/booking",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("venue").notEmpty().withMessage("Venue is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newBooking = new Booking(req.body);
      await newBooking.save();
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/api/booking", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
