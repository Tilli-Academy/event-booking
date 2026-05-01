const Booking = require("../models/Booking");
const Service = require("../models/Service");
const AppError = require("../utils/AppError");

/**
 * Create a booking after checking for double-booking conflicts.
 * A conflict exists when the same service + date already has an "accepted" booking.
 */
exports.create = async ({ userId, serviceId, eventDate, notes }) => {
  // Verify service exists
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError("Service not found", 404);
  }

  // Normalise date to start-of-day for comparison
  const dateStart = new Date(eventDate);
  dateStart.setUTCHours(0, 0, 0, 0);
  const dateEnd = new Date(dateStart);
  dateEnd.setUTCDate(dateEnd.getUTCDate() + 1);

  // Prevent double booking — same service + date with accepted status
  const conflict = await Booking.findOne({
    service: serviceId,
    eventDate: { $gte: dateStart, $lt: dateEnd },
    status: "accepted",
  });

  if (conflict) {
    throw new AppError("This service is already booked for the selected date", 409);
  }

  const booking = await Booking.create({
    user: userId,
    service: serviceId,
    eventDate: dateStart,
    notes: notes || "",
  });

  return booking.populate(["user", "service"]);
};

/**
 * Get all bookings for a specific user.
 */
exports.getUserBookings = async (userId) => {
  return Booking.find({ user: userId })
    .populate("service", "name price")
    .sort({ createdAt: -1 });
};

/**
 * Admin — get all bookings with optional status filter.
 */
exports.getAll = async (statusFilter) => {
  const query = statusFilter ? { status: statusFilter } : {};
  return Booking.find(query)
    .populate("user", "name email")
    .populate("service", "name price")
    .sort({ createdAt: -1 });
};

/**
 * Admin — accept or reject a booking.
 * Re-checks double-booking when accepting.
 */
exports.updateStatus = async (bookingId, status) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status !== "pending") {
    throw new AppError(`Booking is already ${booking.status}`, 400);
  }

  // When accepting, verify no other accepted booking exists for same service + date
  if (status === "accepted") {
    const dateStart = new Date(booking.eventDate);
    dateStart.setUTCHours(0, 0, 0, 0);
    const dateEnd = new Date(dateStart);
    dateEnd.setUTCDate(dateEnd.getUTCDate() + 1);

    const conflict = await Booking.findOne({
      _id: { $ne: bookingId },
      service: booking.service,
      eventDate: { $gte: dateStart, $lt: dateEnd },
      status: "accepted",
    });

    if (conflict) {
      throw new AppError("Another booking for this service and date is already accepted", 409);
    }
  }

  booking.status = status;
  await booking.save();

  return booking.populate(["user", "service"]);
};
