const listeningModel = require("../model/listening.model");

async function recordPlay(req, res) {
    const { title, artist, mood } = req.body;
    if (!title || !artist) return res.status(400).json({ message: "Song title and artist are required." });
    await listeningModel.create({ user: req.userId, type: "play", title, artist, mood });
    res.status(201).json({ message: "Play recorded" });
}

async function recordMood(req, res) {
    if (!req.body.mood) return res.status(400).json({ message: "Mood is required." });
    await listeningModel.create({ user: req.userId, type: "mood", mood: req.body.mood });
    res.status(201).json({ message: "Mood recorded" });
}

async function summary(req, res) {
    const events = await listeningModel.find({ user: req.userId }).sort({ playedAt: -1 }).limit(500).lean();
    const plays = events.filter((event) => event.type === "play");
    const moods = events.filter((event) => event.type === "mood");
    const counts = new Map();
    plays.forEach((play) => {
        const key = `${play.title}|||${play.artist}`;
        counts.set(key, { title: play.title, artist: play.artist, count: (counts.get(key)?.count || 0) + 1 });
    });
    const recentDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - index));
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        const dayMoods = moods.filter((event) => event.playedAt >= date && event.playedAt < next);
        const dayPlays = plays.filter((event) => event.playedAt >= date && event.playedAt < next);
        const moodCounts = dayMoods.reduce((result, event) => {
            result[event.mood] = (result[event.mood] || 0) + 1;
            return result;
        }, {});
        const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "No mood yet";
        return { date: date.toISOString().slice(0, 10), mood: topMood, plays: dayPlays.length };
    });
    res.json({ recentDays, recentPlays: plays.slice(0, 10), mostListened: Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 5) });
}

module.exports = { recordPlay, recordMood, summary };
