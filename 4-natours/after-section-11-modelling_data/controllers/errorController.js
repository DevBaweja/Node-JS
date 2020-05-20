const AppError = require('../Utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFields = (err) => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400);
};
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((cur) => cur.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
    // return new AppError(err.message, 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming or other unknow error
    } else {
        // Log error
        console.error('Error: ', err);
        // Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong',
        });
    }
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Get tour with invalid id
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        else if (error.code === 11000) error = handleDuplicateFields(error);
        else if (error.name === 'ValidationError')
            error = handleValidationError(error);
        sendErrorProd(error, res);
    }
};
