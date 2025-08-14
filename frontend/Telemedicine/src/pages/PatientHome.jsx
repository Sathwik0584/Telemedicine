import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, TextField, Button, Avatar, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const PatientHome = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/doctors`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setFilteredDoctors(data);
      });
  }, []);

  const handleSearch = () => {
    const filtered = doctors.filter((doc) =>
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Browse Doctors
      </Typography>
      <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          variant="outlined"
          placeholder="Search by name or specialization"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px", marginRight: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>
      <Grid container spacing={4}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
              <Card
                sx={{
                  transition: "0.3s",
                  ":hover": { boxShadow: 6, transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      {doctor.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">Dr. {doctor.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Experience: {doctor.experience || "3+ years"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {doctor.rating || "4.5★"}
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => alert(`Booking appointment with Dr. ${doctor.name}`)}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" align="center" sx={{ width: "100%" }}>
            No doctors found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default PatientHome;
