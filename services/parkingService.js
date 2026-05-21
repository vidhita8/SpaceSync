const Slot = require("../models/Slot");
const prisma = require("../config/prisma");

// --------------------
// GET ALL SLOTS
// --------------------

async function getAllSlots() {

    return await Slot.find()
        .sort({ slotNumber: 1 });
}

// --------------------
// PARK VEHICLE
// --------------------

async function parkVehicle(vehicle, imageUrl = null) {

    // validation
    if (!vehicle) {
        throw new Error("Vehicle number required");
    }

    // check duplicate vehicle
    const exists = await Slot.findOne({ vehicle });

    if (exists) {
        throw new Error("Already parked");
    }

    // find empty slot
    const empty =
        await Slot.findOne({ vehicle: null });

    if (!empty) {
        throw new Error("Parking full");
    }

    // assign vehicle
    empty.vehicle = vehicle;

    // save image URL if uploaded
    if (imageUrl) {
        empty.vehicleImage = imageUrl;
    }

    // save slot
    await empty.save();

    // log in PostgreSQL using Prisma
    await prisma.parkingLog.create({
        data: {
            vehicle,
            action: "PARK",
        },
    });

    return empty.slotNumber;
}

// --------------------
// EXIT VEHICLE
// --------------------

async function exitVehicle(vehicle) {

    // validation
    if (!vehicle) {
        throw new Error("Vehicle number required");
    }

    // find vehicle slot
    const slot =
        await Slot.findOne({ vehicle });

    if (!slot) {
        throw new Error("Vehicle not found");
    }

    // clear slot
    slot.vehicle = null;
    slot.vehicleImage = null;

    // save updated slot
    await slot.save();

    // log exit in PostgreSQL
    await prisma.parkingLog.create({
        data: {
            vehicle,
            action: "EXIT",
        },
    });

    return slot.slotNumber;
}

module.exports = {
    getAllSlots,
    parkVehicle,
    exitVehicle,
};