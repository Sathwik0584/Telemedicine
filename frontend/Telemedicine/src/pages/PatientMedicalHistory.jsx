import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PatientMedicalHistory = () => {
  const [expanded, setExpanded] = useState(false);
  const [editable, setEditable] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [history, setHistory] = useState({
    allergies: '',
    chronicDiseases: '',
    pastSurgeries: '',
    otherNotes: ''
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/patients/medical-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const h = res.data || {};
        setHistory({
          allergies: Array.isArray(h.allergies) ? h.allergies.join(', ') : '',
          chronicDiseases: Array.isArray(h.chronicDiseases) ? h.chronicDiseases.join(', ') : '',
          pastSurgeries: Array.isArray(h.pastSurgeries) ? h.pastSurgeries.join(', ') : '',
          otherNotes: h.otherNotes || ''
        });

      } catch (err) {
        console.error("Error fetching medical history", err);
      }
    };

    fetchHistory();
  }, []);

  const handleChange = (field, value) => {
    setHistory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        allergies: history.allergies.split(',').map((a) => a.trim()),
        chronicDiseases: history.chronicDiseases.split(',').map((d) => d.trim()),
        pastSurgeries: history.pastSurgeries.split(',').map((s) => s.trim()),
        otherNotes: history.otherNotes,
      };

      await axios.put(`${BACKEND_URL}/patients/medical-history`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditable(false);
      setSnackbarOpen(true); // show snackbar
    } catch (err) {
      console.error("Failed to save medical history", err);
    }
  };

  return (
    <>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" fontWeight="bold"> Medical History</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              label="Allergies"
              value={history.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              disabled={!editable}
              fullWidth
            />
            <TextField
              label="Chronic Diseases"
              value={history.chronicDiseases}
              onChange={(e) => handleChange('chronicDiseases', e.target.value)}
              disabled={!editable}
              fullWidth
            />
            <TextField
              label="Past Surgeries"
              value={history.pastSurgeries}
              onChange={(e) => handleChange('pastSurgeries', e.target.value)}
              disabled={!editable}
              fullWidth
            />
            <TextField
              label="Other Notes"
              value={history.otherNotes}
              onChange={(e) => handleChange('otherNotes', e.target.value)}
              disabled={!editable}
              fullWidth
              multiline
              rows={3}
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {!editable ? (
                <Button variant="outlined" onClick={() => setEditable(true)}>
                  Edit
                </Button>
              ) : (
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              )}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Medical history updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientMedicalHistory;
