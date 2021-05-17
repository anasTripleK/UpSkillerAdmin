const mongoose = require('mongoose');

const DefectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: { 
    type: Number,
    required: true,
  },
});

module.exports = Defect = mongoose.model('defect', DefectSchema);
