import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Tabs, Tab, Card, Avatar, Paper, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LanguageIcon from '@mui/icons-material/Language';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import VideoCall from './VideoCall';
import PrescriptionForm from './PrescriptionForm';
import ChatBox from './ChatBox';
import PrescriptionHistory from './PrescriptionHistory';
import socket from './socket';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ConsultationRoom = () => {
  const { appointmentId } = useParams();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);

  const handleTabChange = (event, newValue) => setTab(newValue);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const fetchMedicalHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(appointment.patient);
      const res = await axios.get(`${BACKEND_URL}/patients/medical-history/${appointment.patient._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatientHistory(res.data);
      setOpenHistoryDialog(true);
    } catch (err) {
      console.error("Failed to fetch patient history", err);
    }
  };

  if (loading) {
    return <Container sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  if (!appointment || !appointment.doctor) {
    return <Container sx={{ mt: 10 }}><Typography variant="h6" color="error">Failed to load appointment details.</Typography></Container>;
  }

  const doctor = appointment.doctor;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      {/* Header Card */}
      <Card sx={{ mb: 4, p: 3, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={doctor.image || '/default-doctor.png'} alt="Doctor" sx={{ width: 72, height: 72, boxShadow: 2 }} />
          <Box>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon fontSize="small" color="primary" /> Dr. {doctor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
              <ConfirmationNumberIcon fontSize="small" /> Appointment ID: #{appointment._id}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
              <LanguageIcon fontSize="small" /> Mode: {appointment.mode}
            </Typography>
            <Box display="flex" gap={2}>
              {appointment.isDoctorConfirmedComplete && (
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  Doctor ✅
                </Typography>
              )}
              {appointment.isPatientConfirmedComplete && (
                <Typography variant="caption" sx={{ color: 'info.main' }}>
                  Patient ✅
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {role === "doctor" && (
          <Box textAlign="right">
            <Button size="small" variant="outlined" onClick={fetchMedicalHistory}>
              View Patient Medical History
            </Button>
          </Box>
        )}
      </Card>

      {/* Tabs */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ backgroundColor: '#f9f9f9', '& .MuiTab-root': { py: 1.5, fontWeight: 'bold' } }}
        >
          <Tab icon={<ChatIcon />} label="Chat" />
          <Tab icon={<VideoCallIcon />} label="Video Call" />
          <Tab icon={<MedicalServicesIcon />} label="Prescription" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper elevation={2} sx={{ p: 4, minHeight: '300px', borderRadius: 2, backgroundColor: '#ffffff', boxShadow: 2 }}>
        {tab === 0 && <ChatBox appointmentId={appointmentId} socket={socket}sender={role} />}
        {tab === 1 && <VideoCall appointmentId={appointmentId} userName={username} />}
        {tab === 2 && (
          <Box>
            {role === 'doctor' && <PrescriptionForm appointmentId={appointmentId} userRole={role} />}
            <Box mt={4}><PrescriptionHistory appointmentId={appointmentId} /></Box>
          </Box>
        )}
      </Paper>

      {/* Completion Confirmation Button */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        {appointment.status === 'Confirmed' && role === "doctor" && !appointment.isDoctorConfirmedComplete && (
          <Button
            variant="contained"
            color="info"
            onClick={() => setConfirmDialogOpen(true)}
          >
            ✅ Confirm Appointment Completed ({role})
          </Button>
        )}
        {appointment.status === 'Confirmed' && role === "patient" && !appointment.isPatientConfirmedComplete && (
          <Button
            variant="contained"
            color="info"
            onClick={() => setConfirmDialogOpen(true)}
          >
            ✅ Confirm Appointment Completed ({role})
          </Button>
        )}
      </Box>

      {/* Dialog for Medical History */}
      <Dialog open={openHistoryDialog} onClose={() => setOpenHistoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Patient Medical History
          <IconButton onClick={() => setOpenHistoryDialog(false)} sx={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {patientHistory ? (
            <Stack spacing={2}>
              <Typography><strong>Allergies:</strong> {patientHistory.allergies?.join(', ') || 'N/A'}</Typography>
              <Typography><strong>Chronic Diseases:</strong> {patientHistory.chronicDiseases?.join(', ') || 'N/A'}</Typography>
              <Typography><strong>Past Surgeries:</strong> {patientHistory.pastSurgeries?.join(', ') || 'N/A'}</Typography>
              <Typography><strong>Other Notes:</strong> {patientHistory.otherNotes || 'N/A'}</Typography>
            </Stack>
          ) : (
            <Typography>No history available.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Consulation completed Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to confirm that this consultation is completed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="error">Cancel</Button>
          <Button
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const endpoint =
                  role === 'doctor'
                    ? `/api/appointments/${appointmentId}/doctor-complete`
                    : `/api/appointments/${appointmentId}/patient-complete`;

                const res = await axios.put(`${BACKEND_URL}${endpoint}`, {}, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                setAppointment(res.data);
                setConfirmDialogOpen(false);
              } catch (err) {
                console.error("Confirmation failed:", err);
                alert("Something went wrong");
              }
            }}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultationRoom;
