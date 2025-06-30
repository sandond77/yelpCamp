const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post(
	'/register',
	catchAsync(async (req, res) => {
		try {
			const { username, email, password } = req.body;
			const newUser = new User({ username, email });
			const registeredUser = await User.register(newUser, password);
			req.flash('success', 'You have successfully registered for Yelpcamp!');
			res.redirect('/campgrounds');
		} catch (error) {
			req.flash('error', error.message);
			res.redirect('register');
		}
	})
);

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login'
	}),
	(req, res) => {
		req.flash('success', 'Welcome Back to Yelpcamp!');
		res.redirect('/campgrounds');
	}
);

module.exports = router;
