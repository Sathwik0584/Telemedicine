const Appointment = require("../models/appointment.js");
const Review = require("../models/review.js");

module.exports.submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const patientId = req.user.id;
    const appointmentId = req.params.appointmentId;

    const appointment = await Appointment.findById(appointmentId).populate('doctor patient');
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      appointment.patient._id.toString() !== patientId.toString() ||
      appointment.status !== "Completed"
    ) {
      return res.status(403).json({ message: "You can only review completed appointments" });
    }
    
    const existingReview = await Review.findOne({
      appointment: appointment,
    });
   
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this doctor" });
    }

    const newReview = new Review({
      appointment,
      rating,
      comment,
    });

    appointment.isReviewed = true;
    await appointment.save();
    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports.updateReview = async (req, res) => {
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
};

module.exports.getReviews = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
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
};

module.exports.getSingleReview = async (req, res) => {
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
};



