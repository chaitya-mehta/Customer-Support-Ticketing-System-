const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).trim().required().messages({
    'string.empty': 'Name is required',
    'string.min': `Name must be at least 3 characters long`,
    'string.max': `Name cannot exceed 20 characters`,
    'any.required': 'Name is required'
  }),

  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),

  password: Joi.string().min(6).max(10).required().messages({
    'string.empty': 'Password is required',
    'string.min': `Password must be at least 6 characters long`,
    'string.max': `Password cannot exceed 10 characters`,
    'any.required': 'Password is required'
  }),

  role: Joi.string().valid('admin', 'agent', 'customer').default('customer').messages({
    'any.only': 'Role must be one of: admin, agent, customer'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
