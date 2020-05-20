const User = require('../models/userModel');
// const APIFeatures = require('../Utils/apiFeatures');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((cur) => {
        if (allowedFields.includes(cur)) newObj[cur] = obj[cur];
    });
    return newObj;
};
// Users Route Handler
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    // Send Response
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // Create error if user post password data
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword',
                400
            )
        );
    }
    // Filter out unwanted field name that are not allowed to be updated
    const filterBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true,
    });
    // Update user document
    res.status(200).json({
        status: 'success',
        user: updatedUser,
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.createNewUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

exports.getUserById = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

exports.updateUserById = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

exports.deleteUserById = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};
