const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
    // Tour coming from params (url)
    if (!req.body.tour) req.body.tour = req.params.tourId;
    // User coming from current logged in
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReviewById = factory.getOne(Review);
exports.createNewReview = factory.createOne(Review);
exports.updateReviewById = factory.updateOne(Review);
exports.deleteReviewById = factory.deleteOne(Review);
