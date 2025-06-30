const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

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
			console.log(registeredUser);
			req.flash('success', 'You have successfully registered for Yelpcamp!');
			res.redirect('/campgrounds');
		} catch (error) {
			req.flash('error', error.message);
			res.redirect('register');
		}
	})
);

module.exports = router;
