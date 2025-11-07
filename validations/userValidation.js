const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).trim().required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name cannot exceed 20 characters",
    "any.required": "Name is required",
  }),

  email: Joi.forbidden().messages({
    "any.unknown": "Email cannot be updated",
  }),
  password: Joi.forbidden().messages({
    "any.unknown": "Password cannot be updated here",
  }),
  role: Joi.forbidden().messages({
    "any.unknown": "Role cannot be updated",
  }),
  isActive: Joi.forbidden().messages({
    "any.unknown": "Account status cannot be changed",
  }),
});

module.exports = {
  updateUserSchema,
};
