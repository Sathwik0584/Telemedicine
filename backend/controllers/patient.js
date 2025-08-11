const Patient = require("../models/patient");

module.exports.getMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("medicalHistory");
    
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient.medicalHistory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical history", error });
  }
};

module.exports.getHistoryByDoctor =  async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id).select("medicalHistory");
      
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      res.json(patient.medicalHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical history", error });
    }
  };

  module.exports.updateMedicalHistory = async (req, res) => {
    try {
      const { allergies, chronicDiseases, pastSurgeries, otherNotes } = req.body;
  
      const updatedPatient = await Patient.findByIdAndUpdate(
        req.user.id,
        {
          medicalHistory: {
            allergies,
            chronicDiseases,
            pastSurgeries,
            otherNotes,
          },
        },
        { new: true }
      );
     
      res.json({ message: "Medical history updated successfully", medicalHistory: updatedPatient.medicalHistory });
    } catch (error) {
      res.status(500).json({ message: "Failed to update medical history", error });
    }
  };

