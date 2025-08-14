import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Avatar, Rating, Divider, Button } from "@mui/material";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DoctorReviews = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const currentUser = localStorage.getItem("user._id") || "{}";
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/reviews/doctor/${doctorId}`);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [doctorId]);

  const handleEditReview = (review) => {
    navigate(`/review/${review.appointment._id}?edit=true`, {
    state: { review }, // pass entire review object
  });
};

  
  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BACKEND_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // refresh reviews after deletion
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };
  
console.log(reviews);
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Reviews & Ratings
      </Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews yet.</Typography>
      ) : (
        reviews.map((review) => {
          const patient = review.appointment?.patient;
          return (
            <Box key={review._id} sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar src={patient?.image} alt={patient?.name} sx={{ mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">{patient?.name || "Anonymous"}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography sx={{ fontStyle: "italic", color: "#555" }}>{review.comment}</Typography>
              <Divider sx={{ mt: 2 }} />
              <Typography variant="caption" color="textSecondary">
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
              {review.appointment.patient._id === currentUser && (
                <Box display="flex" gap={1} sx={{mt:1.5}}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleEditReview(review)}
                  >
                    Edit
                  </Button>&nbsp;&nbsp;
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default DoctorReviews;
