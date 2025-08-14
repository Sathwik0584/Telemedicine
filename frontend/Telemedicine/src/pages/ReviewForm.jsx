import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, TextField, Button, Box, Rating } from "@mui/material";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ReviewFormPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [review, setReview] = useState(null);
  const isEditing = new URLSearchParams(location.search).get("edit") === "true";

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BACKEND_URL}/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(data);
      } catch (err) {
        setMessage("Could not fetch appointment or it's not eligible for review.");
      }
    }

    fetchAppointment();

    const fetchReview = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BACKEND_URL}/reviews/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReview(data);
        setComment(data.comment);
        setRating(data.rating);
      } catch (err) {
        setMessage("Could not fetch review or it's not eligible for review.");
      }
    };

    if(isEditing) {
      fetchReview();
    }
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = null;
      const token = localStorage.getItem("token");
      if (isEditing) {
        console.log(appointment._id);
        data = await axios.put(
          `${BACKEND_URL}/reviews/${appointment._id}`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate(`/doctor/${appointment.doctor._id}`);
      } else {
        data = await axios.post(
          `${BACKEND_URL}/reviews/${appointment._id}`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage(data.message);
        setTimeout(() => navigate("/appointments"), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box sx={{ backgroundColor: 'white', p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          Leave a Review
        </Typography>
        {message && <Typography color="primary" mb={2}>{message}</Typography>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mr: 2 }}>Rating:</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{
                '& .MuiRating-icon': {
                  color: '#1976d2', // Blue color for stars
                },
              }}
            />
          </Box>

          <TextField
            label="Comment"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              boxShadow: 1,
            }}
          />

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                px: 4,
                py: 1.5,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: 3,
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
              }}
            >
              Submit Review
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ReviewFormPage;
