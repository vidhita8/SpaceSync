const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// --------------------
// REGISTER USER
// --------------------

async function register(req, res) {

    try {

        const {
            username,
            password
        } = req.body;

        // validation
        if (!username || !password) {

            return res.status(400).json({
                message:
                    "Username and password required"
            });
        }

        // check existing user
        const exists =
            await User.findOne({ username });

        if (exists) {

            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const hashed =
            await bcrypt.hash(password, 10);

        // create user
        const user = new User({
            username,
            password: hashed
        });

        await user.save();

        return res.status(201).json({
            message: "User registered"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
}

// --------------------
// LOGIN USER
// --------------------

async function login(req, res) {

    try {

        const {
            username,
            password
        } = req.body;

        // validation
        if (!username || !password) {

            return res.status(400).json({
                message:
                    "Username and password required"
            });
        }

        // find user
        const user =
            await User.findOne({ username });

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            });
        }

        // compare password
        const valid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!valid) {

            return res.status(400).json({
                message: "Wrong password"
            });
        }

        // create JWT token
        const token = jwt.sign(

            {
                userId: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h"
            }
        );

        // store token in cookie
        res.cookie("token", token, {
            httpOnly: true
        });

        // store user in session
        req.session.user = user._id;

        return res.status(200).json({

            message: "Login successful",

            token
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    register,
    login
};