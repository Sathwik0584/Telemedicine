// const express = require('express');
// const { authenticateJWT, authorizeRole } = require('../middleware/auth');

// const router = express.Router();

// // Patient Dashboard (Only patients can access)
// router.get('/patient/dashboard', authenticateJWT, authorizeRole(['patient']), (req, res) => {
//   res.json({ msg: `Welcome to Patient Dashboard, ${req.user.id}` });
// });

// // Doctor Dashboard (Only doctors can access)
// router.get('/doctor/dashboard', authenticateJWT, authorizeRole(['doctor']), (req, res) => {
//   res.json({ msg: `Welcome to Doctor Dashboard, ${req.user.id}` });
// });

// // Admin Panel (Only admins can access)
// router.get('/admin/dashboard', authenticateJWT, authorizeRole(['admin']), (req, res) => {
//   res.json({ msg: `Welcome to Admin Dashboard, ${req.user.id}` });
// });

// module.exports = router;
