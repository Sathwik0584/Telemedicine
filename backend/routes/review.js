const express = require("express");
const controllerReview = require("../controllers/review.js");
const authenticateJWT = require("../middleware/authMiddleware.js"); // Assumes auth middleware
const router = express.Router();

// Route to submit a review
router.post("/:appointmentId", authenticateJWT, controllerReview.submitReview);

// UpdateReview
router.put("/:appointmentId", authenticateJWT, controllerReview.updateReview);

// GET /api/reviews/doctor/:doctorId
router.get('/doctor/:doctorId', controllerReview.getReviews);

//get a review to edit
router.get('/:appointmentId', controllerReview.getSingleReview);

// DELETE /api/reviews/:id
router.delete('/:id', authenticateJWT, controllerReview.deleteReview);

module.exports = router;
