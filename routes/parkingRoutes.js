const express = require("express");

const router = express.Router();

const parkingController =
    require("../controllers/parkingController");

const authMiddleware =
    require("../middleware/authMiddleware");

const sessionAuth =
    require("../middleware/sessionAuth");

// --------------------
// GET ALL SLOTS
// --------------------

router.get(
    "/slots",
    parkingController.getSlots
);

// --------------------
// PARK VEHICLE
// JWT PROTECTED
// --------------------

router.post(
    "/park",
    authMiddleware,
    parkingController.park
);

// --------------------
// EXIT VEHICLE
// JWT PROTECTED
// --------------------

router.delete(
    "/exit/:vehicle",
    authMiddleware,
    parkingController.exit
);

// --------------------
// SESSION AUTH TEST
// --------------------

router.get(
    "/slots-session",
    sessionAuth,
    parkingController.getSlots
);

module.exports = router;