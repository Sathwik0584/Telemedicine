const express = require("express");
const { submitReviewByAppointment } = require("../controllers/reviewController");
const authenticateJWT = require("../middleware/authMiddleware"); // Assumes auth middleware
const Review = require("../models/review.js");
const Appointment = require("../models/appointment.js");
const router = express.Router();

// Route to submit a review
router.post("/:appointmentId", authenticateJWT, submitReviewByAppointment);

router.put("/:appointmentId", authenticateJWT, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const patientId = req.user.id;
    const appointmentId = req.params.appointmentId;

    const appointment = await Appointment.findById(appointmentId).populate('doctor patient');
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const existingReview = await Review.findOne({
      appointment: appointment,
    });

    existingReview.rating = rating;
    existingReview.comment = comment;
    await existingReview.save();
    res.status(201).json({ message: "Review Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/reviews/doctor/:doctorId
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: "appointment",
        populate: [
          { path: "doctor", select: "name _id" },
          { path: "patient", select: "name image _id" }
        ]
      });

    const filteredReviews = reviews.filter(
      (review) => review.appointment.doctor._id.toString() === req.params.doctorId
    );

    res.json(filteredReviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

router.get('/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    const appointment = await Appointment.findById(appointmentId).populate('doctor patient');
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const existingReview = await Review.findOne({
      appointment: appointment,
    });

    res.json(existingReview);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: "appointment",
        populate: [
          { path: "doctor", select: "name _id" },
          { path: "patient", select: "name image _id" }
        ]
      });

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if current user owns the review
    if (review.appointment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Review.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Review deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
