const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

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

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
// CRUD
router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createNewTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTourById)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTourById
    );

module.exports = router;