const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Global Middleware Stack

// Developing logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Http Headers
app.use(helmet());

// Api Limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body Parser
app.use(
    express.json({
        limit: '10kb',
    })
);

// Data Sanitization against NoSql query injection
app.use(mongoSanitize());
// Data Sanitization against xss
app.use(xss());
// Parameter Pollution
app.use(
    hpp({
        whitelist: [
            'ratingsAverage',
            'ratingsQuantity',
            'duration',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

// Serving Static files
app.use(express.static(`${__dirname}/public`));

// User Middleware
app.use((req, res, next) => {
    console.log('Incoming Request');
    // console.log(req.headers);
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//  Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cann't find ${req.url} on this server!`, 404));
});

// Error handling Middleware
app.use(globalErrorHandler);

module.exports = app;
