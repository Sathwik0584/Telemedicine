import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Stack,
    Divider,
    Chip,
    Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import jsPDF from 'jspdf';
import DescriptionIcon from '@mui/icons-material/Description';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PrescriptionHistory = ({ appointmentId }) => {
    const [history, setHistory] = useState([]);
    const [doctor, setDoctor] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${BACKEND_URL}/prescriptions/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistory(res.data);
            } catch (error) {
                console.error('Error fetching prescription history:', error);
            }
        };

        fetchHistory();
    }, [appointmentId]);

    const generatePDF = (prescription) => {
        const doc = new jsPDF();
        let y = 10;

        doc.setFontSize(16);
        doc.text(`Prescription`, 10, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Date: ${new Date(prescription.createdAt).toLocaleString()}`, 10, y);
        y += 10;
        doc.text(`Doctor: ${prescription.doctorId?.name || 'N/A'}`, 10, y);
        y += 10;

        prescription.medicines.forEach((med, i) => {
            doc.text(`Medicine ${i + 1}:`, 10, y);
            y += 8;
            doc.text(`- Name: ${med.name}`, 12, y);
            y += 6;
            doc.text(`- Dosage: ${med.dosage}`, 12, y);
            y += 6;
            doc.text(`- Instructions: ${med.instructions}`, 12, y);
            y += 10;
        });

        if (prescription.notes) {
            doc.text(`Notes: ${prescription.notes}`, 10, y);
        }

        doc.save(`prescription_${prescription._id}.pdf`);
    };

    return (
        <div>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <DescriptionIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                    Prescription History
                </Typography>
            </Stack>

            {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No prescriptions available yet.
                </Typography>
            ) : (
                history.map((prescription, index) => (
                    <Accordion key={index} defaultExpanded={index === 0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {new Date(prescription.createdAt).toLocaleString()}
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            {prescription.medicines.map((med, idx) => (
                                <Stack key={idx} spacing={0.5} mb={2}>
                                    <Typography><strong>Name:</strong> {med.name}</Typography>
                                    <Typography><strong>Dosage:</strong> {med.dosage}</Typography>
                                    <Typography><strong>Instructions:</strong> {med.instructions}</Typography>
                                    <Divider sx={{ my: 1 }} />
                                    {prescription.notes && (
                                        <Typography>
                                            <strong>Notes:</strong> {prescription.notes}
                                        </Typography>
                                    )}
                                </Stack>
                            ))}
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() => generatePDF(prescription)}
                            >
                                Download PDF
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </div>
    );
};

export default PrescriptionHistory;
