import React, { useState, useEffect } from "react";
import {
  Container, Typography, Tabs, Tab, Box, CardMedia, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert, Stack, Divider, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import ReviewForm from "./ReviewForm";
import DoctorReviews from "./DoctorReviews";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ pt: 2 }}>{children}</Box>
  ) : null;
};

const DoctorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [mode, setMode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/doctors/${id}`);
        setDoctor(response.data);
      } catch (error) {
        console.error("Error fetching doctor details", error);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleAppointment = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { from: location } });
      return;
    }
  
    setDialogOpen(false);
  
    navigate("/appointment-summary", {
      state: {
        doctor,
        date: appointmentDate,
        mode,
      },
    });
  };

  if (!doctor) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h6">Loading doctor profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {doctor.image && (
        <CardMedia
          component="img"
          height="300"
          image={doctor.image}
          sx={{
            borderRadius: 5,
            objectFit: "contain", // Changed from "cover" to "contain"
            objectPosition: "center", // Center it instead of aligning to top
            mb: 2,
            backgroundColor: "#f0f4f8", // Optional: gives a light background
          }}
        />

      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} variant="fullWidth">
          <Tab label="Profile" />
          <Tab label="Ratings & Reviews" />
          <Tab label="Book Appointment" />
        </Tabs>
      </Box>

      {/* Profile Info */}
      <TabPanel value={tabIndex} index={0}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Dr. {doctor.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Typography><strong>Gender:</strong> {doctor.gender}</Typography>
          <Typography><strong>Specialization:</strong> {doctor.specialization}</Typography>
          <Typography><strong>Experience:</strong> {doctor.experience} years</Typography>
          <Typography><strong>Clinic Address:</strong> {doctor.clinicAddress}</Typography>
          <Typography><strong>Consultation Fee:</strong> ₹{doctor.fee}</Typography>
        </Stack>
      </TabPanel>

      {/* Ratings & Reviews */}
      <TabPanel value={tabIndex} index={1}>
        <DoctorReviews doctorId={doctor._id} />
      </TabPanel>

      {/* Book Appointment */}
      <TabPanel value={tabIndex} index={2}>
        <Box>
          <h3>Fee : {doctor.fee}</h3>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setDialogOpen(true)}
            sx={{ fontWeight: "bold", py: 1.2 }}
          >
            Book Appointment
          </Button>
        </Box>
      </TabPanel>

      {/* Appointment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", color: "primary.main" }}>
          Book Appointment
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          <TextField
            type="date"
            label="Appointment Date"
            InputLabelProps={{ shrink: true }}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="mode-label">Select Mode</InputLabel>
            <Select
              labelId="mode-label"
              id="mode"
              value={mode}
              label="Select Mode"
              onChange={(e) => setMode(e.target.value)}
              required
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAppointment} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default DoctorProfile;
