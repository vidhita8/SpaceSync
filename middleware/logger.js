// log only important actions (skip GET noise)
function logger(req, res, next) {

    if (req.method !== "GET") {
        console.log(`${req.method} ${req.url}`);
    }

    next();
}

module.exports = logger;