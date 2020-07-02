const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alert)

router.get('/me', authController.protect, viewController.getAccount);

router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
);

router.get('/my-tours', authController.protect, viewController.getMyTours);

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.use(authController.isLoggedIn);

router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;
