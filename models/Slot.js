const mongoose = require("mongoose");

// schema for parking slot
const slotSchema = new mongoose.Schema({
    slotNumber: {
        type: Number,
        required: true
    },

    vehicle: {
        type: String,
        default: null
    },

    vehicleImage: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model("Slot", slotSchema);