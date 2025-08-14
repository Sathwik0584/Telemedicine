import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Doctor-specific fields
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [fee, setFee] = useState("");

  // Patient-specific fields
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseData = { name, email, password, role, gender };
    const roleSpecificData =
      role === "doctor"
        ? { specialization, experience, clinicAddress, fee }
        : role === "patient"
          ? { age }
          : {};

    const response = await fetch(`${BACKEND_URL}user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...baseData, ...roleSpecificData }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Signup successful! Please login.");
      navigate("/login");
    } else {
      alert(data.msg || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // 👈 instead of height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: 2, // 👈 Add some padding to prevent content from touching the edges
      }}
    >

      <Card
        sx={{
          maxWidth: 400,
          padding: 4,
          borderRadius: 3,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
          backgroundColor: "white",
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="role-label">Register As</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Register As"
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>

            {role === "doctor" && (
              <>
                <TextField
                  fullWidth
                  label="Specialization"
                  margin="normal"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Experience (years)"
                  margin="normal"
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Clinic Address"
                  margin="normal"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Consultation Fee"
                  margin="normal"
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  required
                />
              </>
            )}

            {role === "patient" && (
              <>
                <TextField
                  fullWidth
                  label="Age"
                  margin="normal"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Sign Up
            </Button>
          </form>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <span
              style={{ color: "#667eea", cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
