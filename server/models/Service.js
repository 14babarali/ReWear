const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  material: [materialSchema], // Changed from fabricTypes to materialTypes
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
