const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  department: String,
  designation: String,
  qualification: String,
  contactNumber: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: false
  },
  otpExpires: {
    type: Date,
    required: false
  },
  role: { type: String, default: 'admin' }
}, { timestamps: true });


adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Admin', adminSchema);