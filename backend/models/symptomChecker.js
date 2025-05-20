const mongoose = require('mongoose');

const SymptomCheckSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symptoms: [{ type: String, required: true }],  
  possibleConditions: [{ type: String }],  
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SymptomCheck', SymptomCheckSchema);
