const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'shirt' or 'trouser'
  takensize: {
    neck: { type: Number },
    shoulderWidth: { type: Number },
    chestBust: { type: Number },
    waist: { type: Number },
    sleeveLength: { type: Number },
    bicep: { type: Number },
    wrist: { type: Number },
    shirtLength: { type: Number },
    hip: { type: Number },
    inseam: { type: Number },
    outseam: { type: Number },
    thigh: { type: Number },
    knee: { type: Number },
    frontRise: { type: Number },
    backRise: { type: Number },
    legOpening: { type: Number },
  },
  confirmed: { type: Boolean, default: false }, // Whether the user confirmed measurements
});

const requestSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gigId: {type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true},
  userCategory: { type: String, enum: ['male', 'female'], required: true },
  fitType: { type: String, enum: ['classic fit', 'slim fit', 'extreme slim fit'], required: true },
  description: { type: String, required: true },
  picture: { type: String, required: true }, // URL of uploaded picture file
  measurements: {
    shirt: { type: measurementSchema, required: true },
    trouser: { type: measurementSchema, required: false },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TailorRequest', requestSchema);