const express = require("express");
const { createSong, allSongs } = require("../controller/songs.controller");
const requireAdmin = require("../middleware/adminAuth");
const multer = require("multer");
const router = express.Router()

const storage = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 20,
        fileSize: 20 * 1024 * 1024
    }
})

router.post("/song", requireAdmin, storage.array("audioFile"), createSong);
router.get("/songs", allSongs);

module.exports = router