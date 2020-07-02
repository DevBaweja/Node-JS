const mongoose = require('mongoose');

const { Schema } = mongoose;
const getMustHave = (str) => {
    return `A booking must have ${str}`;
};

const def = {
    tour: {
        type: Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, getMustHave('tour.')],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, getMustHave('user.')],
    },
    price: {
        type: Number,
        required: [true, getMustHave('price.')],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true,
    },
};

const bookingSchema = Schema(def);

// Query Middleware
bookingSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email',
    }).populate({
        path: 'tour',
        select: 'name',
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
