function errorHandler(err, req, res, next) {
    if(err) {
        res.status(err.statusCode || 500).json({
            error: err.message
        });
    }
}

module.exports = errorHandler;