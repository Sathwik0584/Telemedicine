const express = require("express");
const router = express.Router();
const controllerDoctor = require("../controllers/doctor.js");

// Get All Doctors
router.get("/", controllerDoctor.getAllDoctors);

// Get individual doctor by ID
router.get('/:id', controllerDoctor.getDoctor);

module.exports = router;
