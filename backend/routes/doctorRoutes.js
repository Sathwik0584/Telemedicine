const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");

// 🔹 Get All Doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find(); // from Doctor collection only
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

// Get individual doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
