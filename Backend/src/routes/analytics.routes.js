const express = require("express");
const requireUser = require("../middleware/userAuth");
const { recordPlay, recordMood, summary } = require("../controller/analytics.controller");

const router = express.Router();
router.use(requireUser);
router.get("/summary", summary);
router.post("/plays", recordPlay);
router.post("/moods", recordMood);

module.exports = router;
