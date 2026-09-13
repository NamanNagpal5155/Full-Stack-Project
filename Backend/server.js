const dotenv = require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});