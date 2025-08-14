import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import '../css/home.css';
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PatientHome = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/doctors`);
        const doctorsData = Array.isArray(response.data) ? response.data : [];
        setDoctors(doctorsData);
      } catch (error){
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(term) ||
      doctor.specialization.toLowerCase().includes(term)
    );
  });

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const pageCount = Math.ceil(filteredDoctors.length / doctorsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
        Find Your Doctor
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            bgcolor: "#f1f3f4",
            borderRadius: "30px",
            px: 2,
            py: 1,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            "&:focus-within": {
              bgcolor: "#ffffff",
              boxShadow: "0 0 0 2px #1976d2",
            },
          }}
        >
          <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
          <TextField
            variant="standard"
            placeholder="Search by name or specialization..."
            InputProps={{ disableUnderline: true }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      <Grid container spacing={7} justifyContent="flex-start">
        {currentDoctors.map((doctor) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={doctor._id}
            sx={{ display: "flex" }}
          >
            <Card
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 4,
                boxShadow: 4,
                bgcolor: "#f9f9f9",
                width: 280,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  height: 195,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  overflow: "hidden",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "top" }}
                  />
                ) : (
                  <Avatar sx={{ width: 80, height: 80, fontSize: 24 }}>
                    {doctor.name?.charAt(0).toUpperCase() || "D"}
                  </Avatar>
                )}
              </Box>

              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Dr. {doctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doctor.specialization}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/doctor/${doctor._id}`}
                  fullWidth
                >
                  View Profile
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default PatientHome;
