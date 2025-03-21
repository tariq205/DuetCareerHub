const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }, // Single ObjectId
  rollNumber: { type: String, required: true},
  graduationYear: { type: Number, required: true },
  degree: { type: String, required: true },
  currentJobTitle: { type: String },
  companyName: { type: String },
  contactNumber: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'alumni' },
  profilePicture: String,
  resume: {
    data: Buffer,
    contentType: String
  },
  portfolioURL: String,
  pastJobExperiences: [String],
  skills: [String],
  certifications: [String],
  socialLinks: {
    linkedIn: String,
  },
  achievements: [String],
  personalizedDescription: String,
  createdAt: { type: Date, default: Date.now },
  otp: {
    type: String,
    required: false
  },
  otpExpires: {
    type: Date,
    required: false
  }
});

alumniSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Alumni", alumniSchema);