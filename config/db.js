const mongoose = require("mongoose");

// connect to MongoDB
const connectDB = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB Connected");

    } catch (error) {

        console.error(
            "DB Error:",
            error.message
        );

        // stop server if DB connection fails
        process.exit(1);
    }
};

module.exports = connectDB;