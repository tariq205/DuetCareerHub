const Alumni = require('../models/Alumni');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Create Alumni
exports.createAlumni = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
        status: false,
        responseCode: 400, 
        message: errors.array().map(error => error.msg).join(', ') });
  }

  try {
    const { 
       name, lastname, department, rollNumber, 
       graduationYear, degree, currentJobTitle, companyName,
       contactNumber, email, password } = req.body;

    // Check if rollNumber already exists within the same department
    const existingAlumni = await Alumni.findOne({ rollNumber, department });
    if (existingAlumni) {
      return res.status(400).json({ 
        status: false, responseCode: 400, 
        message: "Roll number already exists in this department, please use a different roll number." });
    }

    // Check if email already exists
    const existingEmail = await Alumni.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ status: false, responseCode: 400, message: "Email already exists, please use a different email." });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new alumni instance
    const alumni = new Alumni({ 
      name, 
      lastname, 
      department, 
      rollNumber, 
      graduationYear, 
      degree, 
      currentJobTitle, 
      companyName, 
      contactNumber, 
      email,
      password: hashedPassword 
    });

    await alumni.save();

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni created successfully!",
      data: {
        _id: alumni._id,
        first_name: alumni.name,
        last_name: alumni.lastname,
        email: alumni.email,
        phone: alumni.contactNumber,
        user_type: "alumni"
      }
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400, 
      message: error.message });
  }
};

// Get All Alumni (with Pagination and Search)
exports.getAllAlumni = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    search = search.trim();

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ]
    };

    const alumni = await Alumni.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalAlumni = await Alumni.countDocuments(query);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni fetched successfully!",
      count: totalAlumni,
      data: alumni
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400, 
      message: error.message });
  }
};

// Get Alumni by ID
exports.getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ 
        status: false, 
        responseCode: 404, 
        message: "Alumni not found" });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni fetched successfully!",
      data: alumni
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400,
       message: error.message });
  }
};

// Update Alumni
exports.updateAlumni = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: false, 
      responseCode: 400,
       message: errors.array().map(error => error.msg).join(', ') });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }
    const alumni = await Alumni.findByIdAndUpdate(id, updateData, { new: true });
    if (!alumni) {
      return res.status(404).json({ 
        status: false,
         responseCode: 404, 
         message: "Alumni not found" });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni updated successfully!",
      data: alumni
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400, 
      message: error.message });
  }
};

// Delete Alumni
exports.deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        status: false, 
        responseCode: 400,
         message: "Invalid ID format"
         });
    }

    // Check if the alumni exists
    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({ 
        status: false, 
        responseCode: 404, 
        message: "Alumni not found" });
    }

    // Delete the alumni
    await Alumni.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({ status: false, 
      responseCode: 500, 
      message: error.message });
  }
};