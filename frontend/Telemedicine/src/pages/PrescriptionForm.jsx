import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Stack
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PrescriptionForm = ({ appointmentId, userRole }) => {
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/prescriptions/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.medicines?.length > 0) {
          setMedicines(res.data.medicines);
          setNotes(res.data.notes || '');
          if (userRole === "patient") setReadonly(true);
        }
      } catch (err) {
        console.log("No prescription yet or error fetching");
      }
    };

    fetchPrescription();
  }, [appointmentId, userRole]);

  const handleChange = (index, field, value) => {
    const newList = [...medicines];
    newList[index][field] = value;
    setMedicines(newList);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', instructions: '' }]);
  };

  const removeMedicine = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const savePrescription = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BACKEND_URL}/prescriptions/save`, {
        appointmentId,
        medicines,
        notes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Prescription saved successfully!");
    } catch (error) {
      alert("Error saving prescription.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Prescription</Typography>

      {medicines.map((med, index) => (
        <Stack key={index} spacing={1} direction="row" mb={2}>
          <TextField
            label="Medicine Name"
            value={med.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            disabled={readonly}
          />
          <TextField
            label="Dosage"
            value={med.dosage}
            onChange={(e) => handleChange(index, "dosage", e.target.value)}
            disabled={readonly}
          />
          <TextField
            label="Instructions"
            value={med.instructions}
            onChange={(e) => handleChange(index, "instructions", e.target.value)}
            disabled={readonly}
          />
          {!readonly && (
            <IconButton onClick={() => removeMedicine(index)} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      ))}

      {/* Notes Field */}
      <TextField
        label="Notes"
        multiline
        rows={2}
        fullWidth
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={readonly}
        sx={{ mt: 2 }}
      />

      {!readonly && (
        <Box mt={2}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={addMedicine}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Add Medicine
          </Button>
          <Button
            onClick={savePrescription}
            variant="contained"
            color="primary"
          >
            Save Prescription
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PrescriptionForm;
