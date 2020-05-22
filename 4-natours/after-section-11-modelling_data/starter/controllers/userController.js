const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((cur) => {
        if (allowedFields.includes(cur)) newObj[cur] = obj[cur];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
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
        message: 'This route is not defined! Please use /signup',
    });
};
// Users Route Handler
exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getOne(User);
exports.updateUserById = factory.updateOne(User);
exports.deleteUserById = factory.deleteOne(User);
