const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const calculateDuration = require('../utils/rideDuration');

exports.addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json({data:vehicle,msg:"Vehcile Added successfully"});
  } catch (error) {
    console.error("err>>",error)
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

  try {
    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired } });
    const duration = calculateDuration(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000); 

    const bookings = await Booking.find({
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    const bookedVehicleIds = bookings.map(b => b.vehicleId.toString());
    const availableVehicles = vehicles.filter(v => !bookedVehicleIds.includes(v._id.toString()));

    res.status(200).json({ estimatedRideDurationHours: duration, availableVehicles,msg:"Sucessfully fetched data" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
