const mongoose = require("mongoose");

// schema for user (authentication)
const userSchema = new mongoose.Schema({
    username: String,
    password: String // stored as hashed password
});

module.exports = mongoose.model("User", userSchema);