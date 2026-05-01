const bookingService = require("../services/bookingService");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/bookings
exports.create = asyncHandler(async (req, res) => {
  const { serviceId, eventDate, notes } = req.body;
  const booking = await bookingService.create({
    userId: req.user._id,
    serviceId,
    eventDate,
    notes,
  });

  res.status(201).json({ success: true, data: booking });
});

// GET /api/bookings/my
exports.getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user._id);

  res.json({ success: true, count: bookings.length, data: bookings });
});
