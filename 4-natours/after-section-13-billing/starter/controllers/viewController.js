const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    // Get tour data from collection
    const tours = await Tour.find();
    // Build template
    // Render template from tour data
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // Get data for the requested tour (including reviews and tour-guides)
    const { slug } = req.params;
    const tour = await Tour.findOne({ slug }).populate({
        path: 'reviews',
        select: 'review rating user',
    });
    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account',
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    // Find all bookings
    const bookings = await Booking.find({ user: req.user.id });
    //Find tour with returned IDs
    const tourIds = bookings.map((cur) => cur.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
});

exports.updateUserData = catchAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).render('account', {
        title: 'Your Account',
        user: updatedUser,
    });
});
