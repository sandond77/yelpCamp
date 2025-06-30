const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post(
	'/',
	validateReview,
	isLoggedIn,
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const campground = await Campground.findById(id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		campground.reviews.push(review);
		await campground.save();
		await review.save();
		req.flash('success', 'New Review Added!');
		res.redirect(`/campgrounds/${id}`);
	})
);

router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'Successfully deleted review');
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
