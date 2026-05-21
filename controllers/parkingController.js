const parkingService = require("../services/parkingService");

// --------------------
// GET ALL SLOTS
// --------------------

async function getSlots(req, res) {

    try {

        const slots =
            await parkingService.getAllSlots();

        return res.status(200).json(slots);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
}

// --------------------
// PARK VEHICLE
// --------------------

async function park(req, res) {

    try {

        const vehicle = req.query.vehicle;

        // validation
        if (!vehicle) {
            return res.status(400).json({
                message: "Vehicle number required"
            });
        }

        const slotNumber =
            await parkingService.parkVehicle(vehicle);

        console.log(
            `PARK → ${vehicle} → Slot ${slotNumber}`
        );

        // realtime update
        const io = req.app.get("io");

        if (io) {
            io.emit("slotsUpdated");
        }

        return res.status(200).json({
            message: `Parked at slot ${slotNumber}`
        });

    } catch (err) {

        return res.status(400).json({
            message: err.message
        });
    }
}

// --------------------
// EXIT VEHICLE
// --------------------

async function exit(req, res) {

    try {

        const vehicle = req.params.vehicle;

        // validation
        if (!vehicle) {
            return res.status(400).json({
                message: "Vehicle number required"
            });
        }

        const slotNumber =
            await parkingService.exitVehicle(vehicle);

        console.log(
            `EXIT → ${vehicle} → Slot ${slotNumber}`
        );

        // realtime update
        const io = req.app.get("io");

        if (io) {
            io.emit("slotsUpdated");
        }

        return res.status(200).json({
            message: `Exited from slot ${slotNumber}`
        });

    } catch (err) {

        return res.status(400).json({
            message: err.message
        });
    }
}

module.exports = {
    getSlots,
    park,
    exit
};