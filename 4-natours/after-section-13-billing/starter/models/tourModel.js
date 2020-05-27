const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema } = mongoose;

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
        set: (val) => Math.round(val * 10) / 10,
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
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        },
        address: String,
        description: String,
    },
    locations: [
        {
            type: { type: String, default: 'Point', enum: ['Point'] },
            coordinates: { type: [Number] },
            address: String,
            description: String,
            day: Number,
        },
    ],
    // Referencing
    guides: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
};

const options = {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
};
const tourSchema = new Schema(def, options);

// Indexing

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
    const noOfDays = 7;
    if (this.duration) return this.duration / noOfDays;
});
// Virtual Populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'tour',
});

// Middlewares

// Document Middleware
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '_id name photo role',
    });
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
