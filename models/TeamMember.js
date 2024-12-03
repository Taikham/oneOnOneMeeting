const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" },
});

module.exports = mongoose.model("TeamMember", teamMemberSchema);