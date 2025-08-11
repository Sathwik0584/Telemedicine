const Appointment = require("../models/appointment.js");

module.exports.bookAppointments = async (req, res) => {
  const { doctor, date, mode } = req.body;
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ msg: "Only patients can book appointments" });
    }

    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctor,
      date,
      mode
    });

    await appointment.save();
    res.status(201).json({ msg: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

module.exports.showAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name image email specialization experience')
      .populate('patient', 'name image email');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Optional: Only allow access to the patient or doctor involved
    // console.log(req.user);
    // const userId = req.user.id.toString();
    // if (
    //   appointment.patient._id.toString() !== userId &&
    //   appointment.doctor._id.toString() !== userId
    // ) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user.id })
        .populate("patient", "name")
        .sort({ bookingCreatedAt: -1 }); // 🔽 Sorts by latest appointment date first
    } else {
      appointments = await Appointment.find({ patient: req.user.id })
        .populate("doctor", "name specialization")
        .sort({ bookingCreatedAt: -1 });
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

module.exports.confirmAppointment = async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ msg: "Access denied!" });
  }

  const { status } = req.body;
  if (!["Confirmed", "Cancelled"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status update" });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    appointment.status = status;
    await appointment.save();
    res.json({ msg: `Appointment ${status.toLowerCase()}!`, appointment });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.patientCompleted = async (req, res) => {
  try {
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isPatientConfirmedComplete: true },
      { new: true }
    );

    if (appointment.isDoctorConfirmedComplete) {
      appointment.status = 'Completed';
      await appointment.save();
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Patient completion failed' });
  }
};

module.exports.doctorCompleted = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isDoctorConfirmedComplete: true },
      { new: true }
    );
    
    if (appointment.isPatientConfirmedComplete) {
      appointment.status = 'Completed';
      await appointment.save();
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Doctor completion failed' });
  }
};

