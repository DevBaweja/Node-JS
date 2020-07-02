const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // Get currenly booked tour
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) {
        return next(new AppError('There is no document with that ID', 404));
    }
    // Create chekcout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get(
            'host'
        )}/my-tours?alert=booking`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `${req.protocol}://${req.get('host')}/img/tours/${
                        tour.imageCover
                    }`,
                ],
                amount: tour.price * 100,
                currency: 'inr',
                quantity: 1,
            },
        ],
    });
    // Send session to res
    res.status(200).json({
        status: 'success',
        session,
    });
});

const createBookingCheckout = catchAsync(async (session) => {
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.display_items[0].amount / 100;
    await Booking.create({ tour, user, price });
});
exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}}`);
    }

    if (event.type === 'checkout.session.completed')
        createBookingCheckout(event.data.object);

    res.status(200).json({
        received: true,
    });
};

exports.createNewBooking = factory.createOne(Booking);
exports.getBookingById = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBookingById = factory.updateOne(Booking);
exports.deleteBookingById = factory.deleteOne(Booking);
