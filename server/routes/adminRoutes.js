const router = require("express").Router();
const { getAllBookings, updateBookingStatus } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const validate = require("../middleware/validate");

router.use(protect, admin); // All admin routes require auth + admin role

router.get("/bookings", getAllBookings);

router.patch(
  "/bookings/:id/status",
  validate({
    status: { required: true, enum: ["accepted", "rejected"], label: "Status" },
  }),
  updateBookingStatus
);

module.exports = router;
