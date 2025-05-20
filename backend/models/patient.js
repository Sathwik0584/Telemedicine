const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image : {type:String, default: ""},
  email: { type: String, unique: true, required:true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  role:{ type: String, required: true },
  age: {type: String},
  medicalHistory: {
    allergies: { type: [String], default: [] },
    chronicDiseases: { type: [String], default: [] },
    pastSurgeries: { type: [String], default: [] },
    otherNotes: { type: String, default: '' }
  }
});

module.exports = mongoose.model('Patient', patientSchema);
