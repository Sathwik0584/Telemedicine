import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { useLocation,useNavigate } from "react-router-dom";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { motion } from "framer-motion";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user._id", data.user.id);
      localStorage.setItem("username", data.user.name);
      navigate(from, { replace: true });
      // navigate("/");
    } else {
      alert(data.msg || "Login failed");
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh", background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ maxWidth: 400, padding: 4, boxShadow: 5, borderRadius: 3, textAlign: "center", backgroundColor: "white" }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">Login</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
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
              <InputLabel id="role-label">Login As</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Login As"
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, fontWeight: "bold", paddingY: 1 }}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account? <span style={{ color: "#667eea", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/signup")}>
              Sign up
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Login;
