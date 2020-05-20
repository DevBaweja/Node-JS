const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middleware Stack
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// User Middleware
app.use((req, res, next) => {
    console.log('Incoming Request');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//  Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// If code make up to this point meaning no route is defined
// in all above router for this route
app.all('*', (req, res, next) => {
    /*
    const err = new Error(`Cann't find ${req.url} on this server!`);
    err.statusCode = 404;
    err.status = 'fail';
    */

    next(new AppError(`Cann't find ${req.url} on this server!`, 404));
});

// Error handling Middleware
app.use(globalErrorHandler);

module.exports = app;
