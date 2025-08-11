const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

module.exports.signUp = async (req, res) => {
  const { name, email, password, role, gender } = req.body;

  try {
    // Check if email already exists in both collections
    const doctorExists = await Doctor.findOne({ email });
    const patientExists = await Patient.findOne({ email });
    if (doctorExists || patientExists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
};

module.exports.login = async (req, res) => {
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
       process.env.JWT_SECRET,
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
};

module.exports.logout = (req, res) => {
  req.logout();
  res.json({ msg: 'Logged out successfully' });
};