const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

module.exports.registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const newUser = new User({ username, email });
		const registeredUser = await User.register(newUser, password);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash('success', 'You have successfully registered for Yelpcamp!');
			res.redirect('/campgrounds');
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	// Now we can use res.locals.returnTo to redirect the user after login
	req.flash('success', 'Welcome back!');
	const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash('success', 'You have successfully logged out!');
		res.redirect('/campgrounds');
	});
};
