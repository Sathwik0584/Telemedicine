const Prescription = require("../models/prescription.js");
const Appointment = require("../models/appointment.js");

module.exports.savePrescription = async (req, res) => {
    try {
        const { appointmentId, medicines, notes } = req.body;

        const appointment = await Appointment.findById(appointmentId).populate('doctor patient');
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const prescription = new Prescription({
            appointmentId,
            doctorId: appointment.doctor._id,
            patientId: appointment.patient._id,
            medicines,
            notes
        });

        await prescription.save();
        res.status(201).json({ message: 'Prescription saved successfully!', prescription });
    } catch (error) {
        console.error("❌ Error saving prescription:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getPrescriptions = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const prescriptions = await Prescription.find({ appointmentId })
            .populate('doctorId', 'name')  // This line will include only the name field of the doctor
            .sort({ createdAt: -1 });

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
};