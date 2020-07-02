const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const getMustHave = (str) => {
    return `A tour must have ${str}`;
};

const def = {
    name: {
        type: String,
        required: [true, getMustHave('name')],
        unique: true,
        trim: true,
        maxlength: [40, getMustHave('less or equal than 40 char')],
        minlength: [10, getMustHave('more or equal than 10 char')],
        // validate: [validator.isAlpha, getMustHave('only characters')],
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, getMustHave('duration')],
    },
    maxGroupSize: {
        type: Number,
        required: [true, getMustHave('group size')],
    },
    difficulty: {
        type: String,
        required: [true, getMustHave('difficulty')],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either : easy,medium,difficult',
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, getMustHave('price')],
    },
    priceDiscount: {
        type: Number,
        validate: {
            // this only points to current doc on New document creation
            validator: function (val) {
                return val < this.price;
            },
            message: 'Discount price, {VALUE} should be below regular price',
        },
    },
    summary: {
        type: String,
        trim: true,
        required: [true, getMustHave('description')],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, getMustHave('cover image')],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
};

const options = {
    toJSON: { getters: true },
    toObject: { getters: true },
};
const tourSchema = new mongoose.Schema(def, options);
// Another way
/*
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });
*/
// Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
    const noOfDays = 7;
    return this.duration / noOfDays;
});

// Middlewares

// Document Middleware
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    // console.log(this);
    next();
});

/*
tourSchema.pre('save', function (next) {
    console.log('Will save document');
    next();
});

tourSchema.post('save', function (doc, next) {
    console.log(doc);
    next();
});
*/
// Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    // console.log(this);
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    // console.log(this.pipeline());
    next();
});
const Tour = mongoose.model('Tour', tourSchema);
// To create document
// Tour.create({})
module.exports = Tour;
