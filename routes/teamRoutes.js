const express = require("express");
const { getTeamMembers } = require("../controllers/teamController");

const router = express.Router();

router.get("/:manager_id", getTeamMembers);

module.exports = router;