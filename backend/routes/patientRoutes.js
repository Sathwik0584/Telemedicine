// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const  authenticateJWT  = require("../middleware/authMiddleware");
const Patient = require("../models/patient");

// Get medical history of logged-in patient
router.get("/medical-history", authenticateJWT, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("medicalHistory");
    
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient.medicalHistory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical history", error });
  }
});

//get medical history my booked doctor
router.get("/medical-history/:id", authenticateJWT, async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id).select("medicalHistory");
      
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      res.json(patient.medicalHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical history", error });
    }
  });

// Update medical history
router.put("/medical-history", authenticateJWT, async (req, res) => {
    try {
      const { allergies, chronicDiseases, pastSurgeries, otherNotes } = req.body;
  
      const updatedPatient = await Patient.findByIdAndUpdate(
        req.user.id,
        {
          medicalHistory: {
            allergies,
            chronicDiseases,
            pastSurgeries,
            otherNotes,
          },
        },
        { new: true }
      );
     
      res.json({ message: "Medical history updated successfully", medicalHistory: updatedPatient.medicalHistory });
    } catch (error) {
      res.status(500).json({ message: "Failed to update medical history", error });
    }
  });
  
module.exports = router;
