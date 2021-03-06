const Tour = require('../models/tourModel');
const APIFeatures = require('../Utils/apiFeatures');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

// Aliasing
exports.aliasLimit = (req, res, next) => {
    req.query.limit = '5';
    req.query.fields = 'name,price,difficulty,ratingsAverage,summary';
    next();
};
exports.aliasTopBest = (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    next();
};
exports.aliasTopCheap = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage,';
    req.query.fields = 'name,price,difficulty,ratingsAverage,summary';
    next();
};

// Tours Route Handler
exports.getAllTours = catchAsync(async (req, res, next) => {
    // console.log(req.query);
    // Execute query
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

    // Send Response
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
});

exports.getTourById = catchAsync(async (req, res, next) => {
    // console.log(req.params);
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

exports.updateTourById = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});
exports.deleteTourById = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: {
                avgPrice: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = +req.params.year;
    console.log(year);
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                numTourStarts: -1,
            },
        },
        {
            $limit: 12,
        },
    ]);
    res.status(200).json({
        status: 'success',
        results: plan.length,
        data: {
            plan,
        },
    });
});
