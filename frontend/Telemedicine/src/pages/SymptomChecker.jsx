import React, { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeSymptoms = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://telemedicine-0i2m.onrender.com/api/symptom-checker/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });
      const data = await response.json();
      console.log(data);
      setDiagnosis(data.diagnosis);
    } catch (error) {
      setDiagnosis("Error fetching diagnosis.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h5">AI Symptom Checker</Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Describe your symptoms"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button variant="contained" onClick={analyzeSymptoms} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Analyze"}
      </Button>
      {diagnosis && <Typography variant="body1" sx={{ mt: 2 }}>{diagnosis}</Typography>}
    </Box>
  );
};

export default SymptomChecker;
