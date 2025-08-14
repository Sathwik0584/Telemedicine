import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const AppointmentSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, date, mode } = location.state || {};

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handlePayment = async () => {

    const res = await loadRazorpayScript();

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

    try {
      const token = localStorage.getItem("token");
      const patientId = localStorage.getItem("user._id");

      if (!token || !patientId) {
        navigate("/login");
        return;
      }

      // Call backend to create Razorpay order
      const { data } = await axios.post(
        `${BACKEND_URL}/payment/create-order`,
        { amount: doctor.fee },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: data.amount,
        currency: "INR",
        name: "TelemedCare",
        description: "Consultation Fee",
        order_id: data.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${BACKEND_URL}/appointments/book`,
              {
                doctor: doctor._id,
                patient: patientId,
                date,
                mode,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setSnackbar({
              open: true,
              message: "Appointment booked and payment successful!",
              severity: "success",
            });

            setTimeout(() => {
              navigate("/appointments");
            }, 2000);
          } catch (error) {
            console.error("Error confirming appointment", error);
          }
        },
        prefill: {
          name: doctor.name,
        },
        theme: {
          color: "#1976d2",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error", error);
      setSnackbar({
        open: true,
        message: "Payment failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!doctor || !date || !mode) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h6">Missing appointment information.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Appointment Summary
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Typography><strong>Doctor:</strong> Dr. {doctor.name}</Typography>
          <Typography><strong>Specialization:</strong> {doctor.specialization}</Typography>
          <Typography><strong>Date:</strong> {date}</Typography>
          <Typography><strong>Mode:</strong> {mode}</Typography>
          <Typography><strong>Fee:</strong> ₹{doctor.fee}</Typography>
        </Stack>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handlePayment}>
            Continue to Pay
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppointmentSummary;
