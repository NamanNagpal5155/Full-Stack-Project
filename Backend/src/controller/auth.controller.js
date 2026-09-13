const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

function createToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
    return { id: user._id, name: user.name, email: user.email };
}

async function signup(req, res) {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
        return res.status(400).json({ message: "Name, email, and a password of 6+ characters are required." });
    }
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await userModel.findOne({ email: normalizedEmail });
        if (existing) return res.status(409).json({ message: "An account with this email already exists." });
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await userModel.create({ name: name.trim(), email: normalizedEmail, passwordHash });
        res.status(201).json({ token: createToken(user._id.toString()), user: publicUser(user) });
    } catch (error) {
        res.status(500).json({ message: "Could not create account.", error: error.message });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email?.trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
            return res.status(401).json({ message: "Email or password is incorrect." });
        }
        res.json({ token: createToken(user._id.toString()), user: publicUser(user) });
    } catch (error) {
        res.status(500).json({ message: "Could not log in.", error: error.message });
    }
}

module.exports = { signup, login };
