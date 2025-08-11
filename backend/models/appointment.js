const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: {
    type: Date, // Appointment date
    required: true,
  },
  mode: {
    type: String,
    enum: ["Online", "Offline"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
  bookingCreatedAt: {
    type: Date,
    default: Date.now, // Records when the booking was made
  },
  prescription: { type: String },
  isReviewed: {
    type: Boolean,
    default: false,
  },
  isDoctorConfirmedComplete: { type: Boolean, default: false },
  isPatientConfirmedComplete: { type: Boolean, default: false }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
