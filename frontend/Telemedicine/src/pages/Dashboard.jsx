import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, CardContent, Typography, Grid, Button, Box } from "@mui/material";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      navigate("/login");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  if (!role) return <Typography variant="h6">Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ boxShadow: 4, borderRadius: 3, textAlign: "center", padding: 4, background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Welcome to {role === "doctor" ? "Doctor" : "Patient"} Dashboard
            </Typography>
            {role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />}
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

const buttonStyles = {
  marginY: 1.5,
  borderRadius: 2,
  fontWeight: "bold",
  textTransform: "none",
};

const DoctorDashboard = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2 }}>Doctor Dashboard</Typography>
    <Button variant="contained" color="primary" fullWidth sx={buttonStyles}>
      View Appointments
    </Button>
    <Button variant="contained" color="secondary" fullWidth sx={buttonStyles}>
      Manage Patients
    </Button>
    <Button variant="contained" color="success" fullWidth sx={buttonStyles}>
      Update Profile
    </Button>
  </Box>
);

const PatientDashboard = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2 }}>Patient Dashboard</Typography>
    <Button variant="contained" color="primary" fullWidth sx={buttonStyles}>
      Book an Appointment
    </Button>
    <Button variant="contained" color="secondary" fullWidth sx={buttonStyles}>
      View Doctors
    </Button>
    <Button variant="contained" color="success" fullWidth sx={buttonStyles}>
      Medical Reports
    </Button>
  </Box>
);

export default Dashboard;
