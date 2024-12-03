const express = require("express");
const {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.put("/:meeting_id", updateBooking);
router.delete("/:meeting_id", deleteBooking);

module.exports = router;
