const express = require("express");
const router = express.Router();
const Prescription = require("../models/prescription");
const Appointment = require("../models/appointment");
const Doctor = require('../models/doctor');
const authenticateJWT = require("../middleware/authMiddleware.js");

// 🔹 Create or Update Prescription for an Appointment
router.post('/save', authenticateJWT, async (req, res) => {
    try {
        const { appointmentId, medicines, notes } = req.body;

        const appointment = await Appointment.findById(appointmentId).populate('doctor patient');
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const prescription = new Prescription({
            appointmentId,
            doctorId: appointment.doctor._id,
            patientId: appointment.patient._id,
            medicines,
            notes
        });

        await prescription.save();
        res.status(201).json({ message: 'Prescription saved successfully!', prescription });
    } catch (error) {
        console.error("❌ Error saving prescription:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 🔹 Get Prescription for an Appointment
router.get('/:appointmentId', authenticateJWT, async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const prescriptions = await Prescription.find({ appointmentId })
            .populate('doctorId', 'name')  // This line will include only the name field of the doctor
            .sort({ createdAt: -1 });

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

module.exports = router;
