require("dotenv").config();

const mongoose = require("mongoose");
const Slot = require("./models/Slot");

// connect using Atlas URL from .env
mongoose.connect(process.env.MONGO_URI);

async function seed() {

    try {

        // remove old slots
        await Slot.deleteMany();

        const slots = [];

        // create 5 parking slots
        for (let i = 1; i <= 5; i++) {

            slots.push({
                slotNumber: i,
                vehicle: null,
                vehicleImage: null
            });

        }

        await Slot.insertMany(slots);

        console.log("✅ Slots created in Atlas DB");

        process.exit();

    } catch (err) {

        console.log(err);
        process.exit(1);

    }

}

seed();