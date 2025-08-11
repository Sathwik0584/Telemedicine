// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const  authenticateJWT  = require("../middleware/authMiddleware");
const controllerPatient = require("../controllers/patient.js");

// Get medical history of logged-in patient
router.get("/medical-history", authenticateJWT, controllerPatient.getMedicalHistory);

//get medical history my booked doctor
router.get("/medical-history/:id", authenticateJWT, controllerPatient.getHistoryByDoctor);
 
// Update medical history
router.put("/medical-history", authenticateJWT, controllerPatient.updateMedicalHistory);
  
module.exports = router;
