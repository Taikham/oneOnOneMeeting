const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },
  teamMember: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMember", required: true },
  slot: { type: Date, required: true },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);