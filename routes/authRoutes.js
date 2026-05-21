const express = require("express");

const router = express.Router();

const passport = require("../config/passport");

const authController =
    require("../controllers/authController");

// --------------------
// REGISTER
// --------------------

router.post(
    "/register",
    authController.register
);

// --------------------
// JWT LOGIN
// --------------------

router.post(
    "/login",
    authController.login
);

// --------------------
// PASSPORT LOGIN
// --------------------

router.post(

    "/login-passport",

    (req, res, next) => {

        passport.authenticate(

            "local",

            (err, user, info) => {

                if (err) {
                    return next(err);
                }

                // login failed
                if (!user) {

                    return res.status(401).json({
                        message:
                            info?.message ||
                            "Login failed"
                    });
                }

                // create session
                req.login(user, (err) => {

                    if (err) {
                        return next(err);
                    }

                    return res.status(200).json({

                        message:
                            "Login successful (Passport)",

                        user: user.username
                    });
                });
            }

        )(req, res, next);
    }
);

// --------------------
// LOGOUT
// --------------------

router.post("/logout", (req, res) => {

    req.logout((err) => {

        if (err) {

            return res.status(500).json({
                message: "Logout failed"
            });
        }

        // destroy session
        req.session.destroy((err) => {

            if (err) {

                return res.status(500).json({
                    message:
                        "Session destruction failed"
                });
            }

            // clear cookie
            res.clearCookie("connect.sid");

            return res.status(200).json({
                message:
                    "Logged out successfully"
            });
        });
    });
});

module.exports = router;