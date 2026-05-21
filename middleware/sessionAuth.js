// --------------------
// SESSION AUTH MIDDLEWARE
// --------------------

function sessionAuth(req, res, next) {

    // check session user
    if (!req.session.user) {

        return res.status(401).json({
            message: "Not logged in (session)"
        });
    }

    next();
}

module.exports = sessionAuth;