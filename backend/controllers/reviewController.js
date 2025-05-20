const Appointment = require("../models/appointment.js");
const Review = require("../models/review.js");

exports.submitReviewByAppointment = async (req, res) => {
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
