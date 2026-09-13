const mongoose = require("mongoose");

const listeningSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    type: { type: String, enum: ["play", "mood"], required: true },
    title: String,
    artist: String,
    mood: String,
    playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("listening_events", listeningSchema);
