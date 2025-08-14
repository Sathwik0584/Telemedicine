import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  Chip, Box, Card, CardContent, Stack, FormControlLabel, Switch
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import RateReviewIcon from "@mui/icons-material/RateReview";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { useNavigate } from 'react-router-dom';
import DoneAllIcon from '@mui/icons-material/DoneAll';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmedOnly, setShowConfirmedOnly] = useState(false);
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user") || "{}";
  const userId = user._id;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setAppointments(data);
  };

  const filteredAppointments = appointments
    .filter((appt) => {
      const nameMatch = role === "patient"
        ? appt.doctor?.name?.toLowerCase().includes(search.toLowerCase()) && appt.patient?._id === userId
        : appt.patient?.name?.toLowerCase().includes(search.toLowerCase()) && appt.doctor?._id === userId;

      const statusMatch = !showConfirmedOnly || appt.status === "Completed";

      return nameMatch && statusMatch;
    });  

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center" gutterBottom>
        Appointments
      </Typography>

      {(role === "patient" || role === "doctor") && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
          <TextField
            variant="outlined"
            placeholder={role === "patient" ? "Search Doctor..." : "Search Patient..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
              sx: {
                paddingY: 1,
                paddingX: 2,
                borderRadius: 3,
                backgroundColor: '#f0f4f8',
                boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
                '& input::placeholder': {
                  opacity: 0.8,
                  fontStyle: 'italic',
                  color: '#888'
                }
              },
            }}
            sx={{
              width: '100%',
              maxWidth: 500,
              mx: 'auto',
              borderRadius: 3,
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showConfirmedOnly}
                onChange={(e) => setShowConfirmedOnly(e.target.checked)}
                color="primary"
              />
            }
            label="Only Completed"
            sx={{ whiteSpace: "nowrap" }}
          />
        </Stack>
      )}

      <List>
        {filteredAppointments.length > 0 ? filteredAppointments.map((appt) => (
          <Card key={appt._id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <Box position="relative">
            <CardContent>
              <ListItem alignItems="flex-start" disablePadding>
                <ListItemText
                  primary={
                    <>
                      <Typography variant="h6" fontWeight="bold">
                        {role === "patient" ? `Dr. ${appt.doctor?.name}` : appt.patient?.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Scheduled Date: {new Date(appt.date).toLocaleDateString()} ({appt.mode})
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Booked On: {new Date(appt.bookingCreatedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </>
                  }
                  secondary={
                    <Stack direction="row" alignItems="center" gap={1} mt={1}>
                      <Chip
                        label={appt.status}
                        icon={
                          appt.status === "Confirmed" ? <CheckCircleIcon /> :
                          appt.status === "Pending" ? <VideoCameraFrontIcon /> :
                          appt.status === "Completed" ? <DoneAllIcon /> :
                          <HighlightOffIcon />
                        }
                        color={
                          appt.status === "Confirmed" ? "success" :
                          appt.status === "Pending" ? "warning" :
                          appt.status === "Completed" ? "info" :
                          "error"
                        }
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                      {(appt.status === "Confirmed" || appt.status === "Completed") && (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ ml: "auto", borderRadius: 2, textTransform: "none" }}
                          onClick={() => navigate(`/consultation/${appt._id}`)}
                        >
                          Join Consultation
                        </Button>
                      )}
                    </Stack>
                  }
                />
              </ListItem>
        
              {role === "doctor" && appt.status === "Pending" && (
                <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await fetch(`${process.env.BACKEND_URL}/appointments/update/${appt._id}`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: "Confirmed" }),
                      });
                      fetchAppointments();
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await fetch(`${BACKEND_URL}appointments/update/${appt._id}`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: "Cancelled" }),
                      });
                      fetchAppointments();
                    }}
                  >
                    Reject
                  </Button>
                </Box>
              )}
        
              {appt.status === "Completed" && !appt.isReviewed && role === "patient" && (
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<RateReviewIcon />}
                    onClick={() => navigate(`/review/${appt._id}`)}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: "bold",
                      boxShadow: 3,
                      backgroundColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#115293",
                      },
                    }}
                  >
                    Leave a Review
                  </Button>
                </Box>
              )}
            </CardContent>
          </Box>
        </Card>        
        )) : (
          <Typography textAlign="center" color="text.secondary">
            No appointments available.
          </Typography>
        )}
      </List>
    </Container>
  );
};

export default Appointments;
