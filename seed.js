const mongoose = require("mongoose");
const Slot = require("./models/Slot");

// connect to DB
mongoose.connect("mongodb://127.0.0.1:27017/spacesync");

// seed initial slots
async function seed() {

    await Slot.deleteMany(); // remove existing data

    const slots = [];

    // create 5 slots
    for (let i = 1; i <= 5; i++) {
        slots.push({ slotNumber: i });
    }

    await Slot.insertMany(slots);

    console.log("Slots created in DB");

    process.exit();
}

seed();