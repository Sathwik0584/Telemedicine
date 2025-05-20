const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require("bcryptjs");
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware'); // Import middlewar

// Register
router.post("/signup", async (req, res) => {
  const { name, email, password, role, gender } = req.body;

  try {
    // Check if email already exists in both collections
    const doctorExists = await Doctor.findOne({ email });
    const patientExists = await Patient.findOne({ email });
    if (doctorExists || patientExists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "doctor") {
      const { specialization, experience, clinicAddress, fee } = req.body;

      const doctor = new Doctor({
        name,
        email,
        password: hashedPassword,
        role,
        gender,
        specialization,
        experience,
        clinicAddress,
        fee,
      });

      await doctor.save();
      return res.status(201).json({ msg: "Doctor registered successfully" });

    } else if (role === "patient") {
      const { age } = req.body;

      const patient = new Patient({
        name,
        email,
        password: hashedPassword,
        role,
        age,
        gender,
      });

      await patient.save();
      return res.status(201).json({ msg: "Patient registered successfully" });
    } else {
      return res.status(400).json({ msg: "Invalid role" });
    }

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!role || !["doctor", "patient"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const Model = role === "doctor" ? Doctor : Patient;

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role },
       "Sathwik2004@",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// // Google OAuth
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
//   res.redirect('/dashboard');
// });

// // Facebook OAuth
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
//   res.redirect('/dashboard');
// });

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ msg: 'Logged out successfully' });
});

// router.get('/profile', authMiddleware, (req, res) => {
//   res.json({ msg: 'Welcome to your profile', user: req.user });
// });

module.exports = router;
