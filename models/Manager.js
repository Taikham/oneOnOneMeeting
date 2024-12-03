const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "TeamMember" }],
});

module.exports = mongoose.model("Manager", managerSchema);