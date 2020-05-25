const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
// View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware Stack
// Serving Static files
app.use(express.static(path.join(__dirname, 'public')));

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
// Form Data
/*
app.use(
    express.urlencoded({
        extended: true,
        limit: '10kb',
    })
);
*/
// Cookie Parser
app.use(cookieParser());

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

// User Middleware
app.use((req, res, next) => {
    console.log('Incoming Request');
    // console.log(req.cookies);
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//  Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cann't find ${req.url} on this server!`, 404));
});

// Error handling Middleware
app.use(globalErrorHandler);

module.exports = app;
