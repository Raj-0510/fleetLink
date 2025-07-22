const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const calculateDuration = require('../utils/rideDuration');

exports.bookVehicle = async (req, res) => {
  const { vehicleId, fromPincode, toPincode, startTime, customerId,vehicleName } = req.body;
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    const duration = calculateDuration(fromPincode, toPincode); 
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000); 

    const overlapping = await Booking.findOne({
      vehicleId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (overlapping) return res.status(409).json({ error: "Vehicle already booked in this time window" });

    const booking = await Booking.create({
      vehicleId, fromPincode, toPincode, startTime: start, endTime: end, customerId,vehicleName
    });

    res.status(201).json({data:booking,msg:"Booking Confirmed"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getBookings=async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const data = await Booking.find({customerId});

    if (!data) {
      return res.status(404).json({ error: "Booking data not found" });
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.deleteBooking=async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ msg: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
