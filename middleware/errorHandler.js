// --------------------
// GLOBAL ERROR HANDLER
// --------------------

function errorHandler(err, req, res, next) {

    console.error(
        "SERVER ERROR:",
        err.message
    );

    return res.status(500).json({

        success: false,

        message: err.message ||
            "Internal Server Error"
    });
}

module.exports = errorHandler;