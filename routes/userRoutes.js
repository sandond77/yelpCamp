const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/usersController');

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.registerUser));

router.get('/login', users.renderLogin);

router.post(
	'/login',
	// use the storeReturnTo middleware to save the returnTo value from session to res.locals
	storeReturnTo,
	// passport.authenticate logs the user in and clears req.session
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login'
	}),
	users.login
);

router.get('/logout', users.logout);

module.exports = router;
