const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

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
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lon',
                400
            )
        );
    }
    // console.log({ distance, lat, lng, unit });
    const filter = {
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius],
            },
        },
    };
    const tours = await Tour.find(filter);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lon',
                400
            )
        );
    }
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                key: 'startLocation',
                near: {
                    type: 'Point',
                    coordinates: [+lng, +lat],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                name: 1,
                distance: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: {
            data: distances,
        },
    });
});

// Tours Route Handler
exports.getAllTours = factory.getAll(Tour);

exports.getTourById = factory.getOne(Tour, [
    {
        path: 'guides',
        select: '_id name email role',
    },
    {
        path: 'reviews',
    },
]);

exports.createNewTour = factory.createOne(Tour);
exports.updateTourById = factory.updateOne(Tour);
exports.deleteTourById = factory.deleteOne(Tour);

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
