const mongoose = require("mongoose");

async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URL || "mongodb://localhost:27017/fullstack-project";
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 2500,
            connectTimeoutMS: 2500,
        });
        console.log("Connected To DB");
    }
    catch (err) {
        console.log("MongoDB connection failed:", err.message);
        console.log("Continuing without MongoDB for local development.");
    }
}
module.exports = connectDB;