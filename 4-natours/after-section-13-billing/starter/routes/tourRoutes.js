const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Merge Params
router.use('/:tourId/reviews', reviewRouter);
// Aliasing
router
    .route('/top-5-best')
    .get(
        tourController.aliasLimit,
        tourController.aliasTopBest,
        tourController.getAllTours
    );
router
    .route('/top-5-cheap')
    .get(
        tourController.aliasLimit,
        tourController.aliasTopCheap,
        tourController.getAllTours
    );

router.route('/tour-stats').get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan
    );

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
// CRUD
router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createNewTour
    );

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTourById
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTourById
    );
module.exports = router;
