const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

const { campgroundValidationSchema } = require('../validationSchemas');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
	const { error } = campgroundValidationSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

router.post(
	'/',
	validateCampground,
	isLoggedIn,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		campground.author = req.user._id;
		await campground.save();
		req.flash('success', 'Successfully made a new campground!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
			.populate('reviews')
			.populate('author');
		if (!campground) {
			req.flash('error', 'Campground does not exist!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);

router.put(
	'/:id',
	validateCampground,
	isLoggedIn,
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const camp = await Campground.findById(id);
		if (!camp.author.equals(req.user._id)) {
			req.flash('error', 'You do not have permission to do this!');
			return res.redirect(`/campgrounds/${id}`);
		}
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground
		});
		req.flash('success', 'Successfully updated campground!');
		res.redirect(`/campgrounds/${id}`);
	})
);

router.get(
	'/:id/edit',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const camp = await Campground.findById(id);
		if (!campground) {
			req.flash('error', 'Campground does not exist!');
			return res.redirect('/campgrounds');
		}
		if (!camp.author.equals(req.user._id)) {
			req.flash('error', 'You do not have permission to do this!');
			return res.redirect(`/campgrounds/${id}`);
		}
		res.render('campgrounds/edit', { campground });
	})
);

router.delete(
	'/:id',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const camp = await Campground.findById(id);
		if (!camp.author.equals(req.user._id)) {
			req.flash('error', 'You do not have permission to do this!');
			return res.redirect(`/campgrounds/${id}`);
		}
		const campground = await Campground.findByIdAndDelete(id);
		req.flash('success', 'Successfully deleted campground!');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
