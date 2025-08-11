const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image : {type:String, default: ""},
  email: { type: String, unique: true, required:true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  role:{ type: String, required: true },
  specialization: { type: String, required: true },
  experience: String,
  clinicAddress: String,
  fee: Number,
});

module.exports = mongoose.model("Doctor", doctorSchema);
