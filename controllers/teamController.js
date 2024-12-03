const TeamMember = require("../models/TeamMember");

exports.getTeamMembers = async (req, res) => {
  try {
    const { manager_id } = req.params;
    const teamMembers = await TeamMember.find({ manager: manager_id });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};