const Joi = require('joi');

module.exports.campgroundValidationSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		price: Joi.number().required().min(0),
		// image: Joi.string().required(),
		location: Joi.string().required(),
		description: Joi.string().required().trim().min(1)
	}).required(),
	deleteImages: Joi.array()
});

module.exports.reviewValidationSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required().trim().min(1),
		rating: Joi.number().required().min(1).max(5)
	}).required()
});
