const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': '{{ #label }} must not include HTML!'
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHTML(value, {
					allowedTags: [],
					allowedAttributes: {}
				});
				if (clean !== value)
					return helpers.error('string.escapeHTML', { value });
				return clean;
			}
		}
	}
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundValidationSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escapeHTML(),
		price: Joi.number().required().min(0),
		// image: Joi.string().required(),
		location: Joi.string().required().escapeHTML(),
		description: Joi.string().required().trim().min(1).escapeHTML()
	}).required(),
	deleteImages: Joi.array()
});

module.exports.reviewValidationSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required().trim().min(1).escapeHTML(),
		rating: Joi.number().required().min(1).max(5)
	}).required()
});
