const mongoose = require('mongoose');
const Tour = require('./tourModel');
const { Schema } = mongoose;

const getMustHave = (str) => {
    return `A review must have ${str}`;
};

const option = {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
};
const def = {
    review: {
        type: String,
        require: [true, getMustHave('body in it.')],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: 'Tour',
        require: [true, 'tour to which it belongs.'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'user to which it belongs.'],
    },
};
const reviewSchema = Schema(def, option);

// Indexing
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query Middleware
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });

    next();
});

// Static Methods
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
};
// Document Middleware
reviewSchema.post('save', function () {
    // Review.calcAverageRatings(this.tour);
    this.constructor.calcAverageRatings(this.tour);
});
// Query Middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here query has already been executed
    if (this.r) await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
