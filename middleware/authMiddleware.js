const jwt = require("jsonwebtoken");

// --------------------
// JWT AUTH MIDDLEWARE
// --------------------

function authMiddleware(req, res, next) {

    let token;

    // check Authorization header
    if (req.headers.authorization) {

        const parts =
            req.headers.authorization.split(" ");

        // validate Bearer token format
        if (
            parts.length === 2 &&
            parts[0] === "Bearer"
        ) {

            token = parts[1];

        } else {

            return res.status(401).json({
                message: "Invalid token format"
            });
        }
    }

    // fallback → cookie token
    if (!token && req.cookies.token) {

        token = req.cookies.token;
    }

    // no token found
    if (!token) {

        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {

        // verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // attach user payload
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = authMiddleware;