function requireAdmin(req, res, next) {
    const configuredPassword = process.env.ADMIN_PASSWORD;
    const providedPassword = req.get("X-Admin-Password");

    if (!configuredPassword) {
        return res.status(503).json({
            message: "Admin uploads are disabled. Configure ADMIN_PASSWORD in .env."
        });
    }

    if (!providedPassword || providedPassword !== configuredPassword) {
        return res.status(401).json({
            message: "Admin authentication required."
        });
    }

    next();
}

module.exports = requireAdmin;