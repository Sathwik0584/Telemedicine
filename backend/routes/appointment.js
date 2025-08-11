const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authMiddleware.js");
const controllerAppointment = require("../controllers/appointment.js");

// Book an Appointment (Patient)
router.post("/book", authenticateJWT, controllerAppointment.bookAppointments);

//Show Appointment
router.get('/:id', authenticateJWT, controllerAppointment.showAppointment);

// Get Appointments (For Patients & Doctors)
router.get("/", authenticateJWT, controllerAppointment.getAppointments);

// Doctor Completion
router.put('/:id/doctor-complete', controllerAppointment.doctorCompleted);

//Patient Completion
router.put('/:id/patient-complete', controllerAppointment.patientCompleted);

// Update Appointment Status (Doctor can confirm/cancel)
router.patch("/update/:id", authenticateJWT, controllerAppointment.confirmAppointment);


//  Cancel Appointment (Patient)
// router.delete("/cancel/:id", authenticateJWT, async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ msg: "Appointment not found" });
//     }

//     if (req.user.role !== "patient" || appointment.patient.toString() !== req.user.id) {
//       return res.status(403).json({ msg: "Unauthorized to cancel this appointment" });
//     }

//     await appointment.deleteOne();
//     res.json({ msg: "Appointment canceled successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: "Server error", error });
//   }
// });

module.exports = router;
