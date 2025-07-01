const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgroundController.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.get('/', catchAsync(campgrounds.index));

router.post(
	'/',
	validateCampground,
	isLoggedIn,
	catchAsync(campgrounds.createCampground)
);

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderEditForm)
);

router.put(
	'/:id',
	validateCampground,
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.editCampground)
);

router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
