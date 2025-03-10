const Event = require('../models/Event');

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, address, date, imageUrl } = req.body;
    const event = new Event({
      title,
      description,
      address,
      date,
      imageUrl // Store image URL directly
    });
    await event.save();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event created successfully!",
      data: {
        _id: event._id,
        title: event.title,
        description: event.description,
        address: event.address,
        date: event.date,
        imageUrl: event.imageUrl
      }
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Events fetched successfully!",
      data: events
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Event not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event fetched successfully!",
      data: event
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, address, date, imageUrl } = req.body;
    const updateData = {
      title,
      description,
      address,
      date,
      imageUrl
    };
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!event) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Event not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event updated successfully!",
      data: event
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Event not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event deleted successfully!"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};