const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authMiddleware"); // Middleware
const controllerProfile = require("../controllers/profile.js");

// GET Profile: Fetch user details
router.get("/", authenticateJWT, controllerProfile.getProfile);

// PUT Update Profile
router.put("/update", authenticateJWT, controllerProfile.updateProfile);


module.exports = router;
