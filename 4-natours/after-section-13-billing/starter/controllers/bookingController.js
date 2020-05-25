const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // Get currenly booked tour
    const tour = await Tour.findById(req.params.tourId);
    // Create chekcout session
    // Send session to res
    if (!tour) {
        return next(new AppError('There is no document with that ID', 404));
    }
});
