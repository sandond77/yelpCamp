const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgroundController.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// prettier-ignore
router.route('/')
	.get(catchAsync(campgrounds.index))
	// .post(
	// 	validateCampground,
	// 	isLoggedIn,
	// 	catchAsync(campgrounds.createCampground)
	// );
	.post(upload.array('image'),(req,res) => 
		console.log(req.body,req.files))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
	.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(
		validateCampground,
		isLoggedIn,
		isAuthor,
		catchAsync(campgrounds.editCampground)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
