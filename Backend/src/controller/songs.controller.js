const mongoose = require("mongoose");
const uploadFile = require("../storage/song.storage");
const songModel = require("../model/songs.model");

const createSong = async (req, res) => {
    const { title, artist, mood } = req.body;
    const data1 = req.files || [];

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "MongoDB is not available. Please start MongoDB or configure a database connection."
        });
    }

    try {
        for (let i = 0; i < data1.length; i++) {
            const fileData = await uploadFile(data1[i]);
            await songModel.create({
                title: Array.isArray(title) ? title[i] : title,
                artist,
                mood,
                audioFile: fileData.url
            });
        }

        res.json({ message: "Song Created" });
    } catch (err) {
        res.status(500).json({
            message: "Song creation failed",
            error: err.message
        });
    }
};

const allSongs = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.json({
            message: "MongoDB is not connected. No songs are available.",
            all: []
        });
    }

    try {
        const all = await songModel.find();
        res.json({
            message: all.length ? "All Songs Fetched" : "No songs uploaded yet.",
            all
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch songs",
            error: err.message,
            all: []
        });
    }
};

module.exports = { createSong, allSongs };