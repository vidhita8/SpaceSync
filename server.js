require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const connectDB = require("./config/db");
const passport = require("./config/passport");

const upload = require("./middleware/upload");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const parkingRoutes = require("./routes/parkingRoutes");
const authRoutes = require("./routes/authRoutes");

const parkingService = require("./services/parkingService");
const Slot = require("./models/Slot");

const app = express();

const PORT = process.env.PORT || 3000;

// --------------------
// DATABASE CONNECTION
// --------------------
connectDB();

// --------------------
// VIEW ENGINE
// --------------------
app.set("view engine", "ejs");

// --------------------
// MIDDLEWARE
// --------------------

// request logger
app.use(logger);

// parse JSON
app.use(express.json());

// parse form data
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// passport authentication
app.use(passport.initialize());
app.use(passport.session());

// serve static files
app.use(express.static("public"));

// --------------------
// SSR ROUTES
// --------------------

// dashboard
app.get("/ssr", async (req, res) => {
    try {
        const slots = await Slot.find().sort({ slotNumber: 1 });

        const success = req.query.success || null;
        const error = req.query.error || null;

        res.render("dashboard", {
            slots,
            success,
            error,
        });

    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// park vehicle
app.post(

    "/ssr/park",

    // upload middleware with error handling
    (req, res, next) => {

        upload.single("vehicleImage")(req, res, function (err) {

            if (err) {
                console.log("UPLOAD ERROR:", err.message);

                return res.status(400).send(err.message);
            }

            next();
        });
    },

    async (req, res) => {

        try {

            const vehicle = req.body.vehicle;

            // uploaded cloudinary image URL
            const imageUrl = req.file.path;

            // occupancy check
            const slots = await Slot.find();
            const occupied = slots.filter(slot => slot.vehicle).length;

            if (occupied === slots.length) {
                console.log(
                    `SYSTEM → ${occupied}/${slots.length} slots occupied`
                );
            }

            // park vehicle
            const slotNumber =
                await parkingService.parkVehicle(
                    vehicle,
                    imageUrl
                );

            console.log(
                `PARK → ${vehicle} → Slot ${slotNumber}`
            );

            // realtime update
            const io = req.app.get("io");
            io.emit("slotsUpdated");

            return res.redirect(
                `/ssr?success=Parked in slot ${slotNumber}`
            );

        } catch (err) {

            console.log(
                `PARK FAILED → ${req.body.vehicle} → ${err.message}`
            );

            if (err.message === "Parking full") {
                console.log(
                    "SYSTEM → All slots are currently occupied"
                );
            }

            return res.redirect(
                `/ssr?error=${encodeURIComponent(err.message)}`
            );
        }
    }
);

// exit vehicle
app.post("/ssr/exit", async (req, res) => {

    try {

        const vehicle = req.body.vehicle;

        const slotNumber =
            await parkingService.exitVehicle(vehicle);

        console.log(
            `EXIT → ${vehicle} → Slot ${slotNumber}`
        );

        // realtime update
        const io = req.app.get("io");
        io.emit("slotsUpdated");

        return res.redirect(
            `/ssr?success=Exited from slot ${slotNumber}`
        );

    } catch (err) {

        console.log(
            `EXIT FAILED → ${req.body.vehicle} → ${err.message}`
        );

        return res.redirect(
            `/ssr?error=${encodeURIComponent(err.message)}`
        );
    }
});

// --------------------
// API ROUTES
// --------------------

app.use("/auth", authRoutes);
app.use("/parking", parkingRoutes);

// --------------------
// GLOBAL ERROR HANDLER
// --------------------

app.use(errorHandler);

// --------------------
// SOCKET.IO SETUP
// --------------------

// create HTTP server
const server = http.createServer(app);

// attach socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// make io accessible globally
app.set("io", io);

// socket connection
io.on("connection", (socket) => {

    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// --------------------
// START SERVER
// --------------------

if (process.env.NODE_ENV !== "test") {

    server.listen(PORT, () => {

        console.log(
            `🚀 Server running on port ${PORT}`
        );
    });
}

// export app for testing
module.exports = app;