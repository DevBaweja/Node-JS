const AppError = require('../utils/appError');

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
const sendErrorDev = (err, req, res) => {
    // Api
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    // Render Website
    // console.error('Error: ', err);

    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
    // Api
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        // Programming or other unknow error
        // Log error
        console.error('Error: ', err);
        // Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong',
        });
    }

    // Render Website
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }

    // Programming or other unknow error
    // Log error
    console.error('Error: ', err);
    // Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later',
    });
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Get tour with invalid id
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        else if (error.code === 11000) error = handleDuplicateFields(error);
        else if (error.name === 'ValidationError')
            error = handleValidationError(error);
        sendErrorProd(error, req, res);
    }
};
