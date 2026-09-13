const jwt = require("jsonwebtoken");

function requireUser(req, res, next) {
    const token = req.get("Authorization")?.replace(/^Bearer\s+/i, "");
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(503).json({ message: "Authentication is not configured." });
    }

    try {
        const payload = jwt.verify(token || "", secret);
        req.userId = payload.userId;
        next();
    } catch {
        res.status(401).json({ message: "Please log in to continue." });
    }
}

module.exports = requireUser;
