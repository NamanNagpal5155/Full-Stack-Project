const express = require("express");
const path = require("path");
const app = express();
const songRouter = require("./routes/songs.routes");
const authRouter = require("./routes/auth.routes");
const analyticsRouter = require("./routes/analytics.routes");
const cors = require("cors");

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins
}));
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({
        message: "MOODIFY API is running",
        endpoints: {
            songs: "/app/songs",
            upload: "/app/song"
        }
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/app", songRouter);
app.use("/auth", authRouter);
app.use("/analytics", analyticsRouter);

const frontendDist = path.join(__dirname, "../../Frontend/dist");
app.use(express.static(frontendDist));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
});

module.exports = app;