const router = require("express").Router();
const { create, getUserBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.use(protect); // All booking routes require auth

router.post(
  "/",
  validate({
    serviceId: { required: true, label: "Service ID" },
    eventDate: { required: true, isDate: true, label: "Event date" },
  }),
  create
);

router.get("/my", getUserBookings);

module.exports = router;
