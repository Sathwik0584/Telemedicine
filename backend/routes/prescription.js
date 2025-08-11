const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authMiddleware.js");
const controllerPrescription = require("../controllers/prescription.js");

// Create or Update Prescription for an Appointment
router.post('/save', authenticateJWT, controllerPrescription.savePrescription);

//Get Prescription for an Appointment
router.get('/:appointmentId', authenticateJWT, controllerPrescription.getPrescriptions);

module.exports = router;
