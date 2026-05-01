const bookingService = require("../services/bookingService");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/bookings?status=pending
exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getAll(req.query.status);

  res.json({ success: true, count: bookings.length, data: bookings });
});

// PATCH /api/admin/bookings/:id/status
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateStatus(req.params.id, req.body.status);

  res.json({ success: true, data: booking });
});
