const Tour = require('../models/tourModel');
const APIFeatures = require('../Utils/apiFeatures');

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
    req.query.sort = 'price,-ratingsAverage,';
    next();
};

// Tours Route Handler
exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        // Build Query

        // 1A) Filtering using query string
        /*
        url = localhost:3000/api/v1/tours?duration=5&difficulty=easy&page=2&sort=1&limit=10
        queryObj = {
            duration: '5',
            difficulty: 'easy',
            page: '2',
            sort: '1',
            limit: '10'
        }
        After basic filtering
        Removing excludes Fields
        queryObj = {
            duration: '5',
            difficulty: 'easy',
        }
        */

        /*
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((cur) => delete queryObj[cur]);
        /*

        // 1B) Advance Filtering using query string
        /*
            url = localhost:3000/api/v1/tours?duration[gte]=5&price[lte]=1000&difficulty=easy&page=2&sort=price&limit=10
            queryObj = {
            duration: { gte: '5' },
            price: { lte: '1000' },
            difficulty: 'easy',
            page: '2',
            sort: 'price',
            limit: '10'
            }
            After basic filtering
            queryObj = {
                duration: { gte : '5' },
                price: { lte: '1000' },
                difficulty: 'easy'
            }
            After advance filtering
            queryObj = {
                duration: { $gte : '5' },
                 price: { $lte: '1000' },
                difficulty: 'easy'
            }
        */
        /*
        let queryStr = JSON.stringify(queryObj);
        // gte,gt,lte,lt
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        
        let query = Tour.find(JSON.parse(queryStr));
        */

        // 2) Sorting
        /*
        url : localhost:3000/api/v1/tours?sort=price
        url : localhost:3000/api/v1/tours?sort=price,-ratingsAverage

        req.query.sort = 'price,-ratingsAverage'
        After Sorting 
        query.sort('price -ratingsAverage)
        */

        /*
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        */

        // 3) Projection or Field Limiting
        /*
        url : localhost:3000/api/v1/tours/fields=name,duration,difficulty,price

        // req.query.fields = 'name,duration,difficulty,price'
        After Projection
        query.select('name duration difficulty price')
        */
        /*
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }
        */

        // 4) Pagination
        /*
        url : localhost:3000/api/v1/tours?page=2&limit=10

        query.skip()
        skip given # of documents

        query.limit()
        limit # of doucment

        Defining default value
        const page = query.page || value;
         */
        /*
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error("This page doesn't exists");
        }
        // query.sort().select().skip().limit()
        */
        // Execute query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;
        /*
        const tours = await Tour.find(query)
        */
        /*
        const tours = await Tour.find({
            key: value,
            key: value,
        })
        */
        /*
        const tours = await Tour.find()
            .where(key, value)
            .where(key, value);
        */
        /*
        const tours = await Tour.find()
            .where(key)
            .equals(value)
            .where(key)
            .equals(value);
        */

        // Send Response
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getTourById = async (req, res) => {
    console.log(req.params);
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne( {_id : req.params.id })
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.createNewTour = async (req, res) => {
    try {
        // const tour = new Tour({});
        // await tour.save().then((doc) => {});

        const tour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
exports.updateTourById = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
exports.deleteTourById = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
