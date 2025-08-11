const express = require('express');
const router = express.Router();
const controllerUser = require("../controllers/user.js");
 // Import middlewar

// Signup
router.post("/signup", controllerUser.signUp);

// Login
router.post("/login", controllerUser.login);

// Logout
router.get('/logout', controllerUser.logout);

// router.get('/profile', authMiddleware, (req, res) => {
//   res.json({ msg: 'Welcome to your profile', user: req.user });
// });

module.exports = router;
