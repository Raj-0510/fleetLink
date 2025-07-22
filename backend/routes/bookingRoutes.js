const express = require('express');
const router = express.Router();
const { bookVehicle, deleteBooking, getBookings } = require('../controllers/bookingController');

router.post('/', bookVehicle);
router.get('/:customerId', getBookings);

router.delete('/delete/:id', deleteBooking);


module.exports = router;
