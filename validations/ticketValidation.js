const Joi = require('joi');

const createTicketSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().required().messages({
    'string.empty': 'Ticket name is required',
    'string.min': 'Ticket name must be at least 3 characters long',
    'string.max': 'Ticket name cannot exceed 50 characters',
    'any.required': 'Ticket name is required'
  }),

  description: Joi.string().min(10).max(500).trim().required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description cannot exceed 500 characters',
    'any.required': 'Description is required'
  }),

  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Category ID is required',
      'any.required': 'Category ID is required',
      'string.pattern.base': 'Invalid Category ID format'
    }),

  priority: Joi.string().valid('low', 'medium', 'high').default('medium').messages({
    'any.only': 'Priority must be one of: low, medium, high'
  }),

  status: Joi.string().valid('open', 'in progress', 'resolved', 'closed').default('open').messages({
    'any.only': 'Status must be one of: open, in progress, resolved, closed'
  }),

  assignedAgent: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid Agent ID format'
    }),

  attachments: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().trim().required().messages({
          'string.empty': 'Filename is required'
        }),
        path: Joi.string().trim().required().messages({
          'string.empty': 'File path is required'
        })
      })
    )
    .optional()
    .messages({
      'array.base': 'Attachments must be an array'
    })
});

const updateTicketSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().optional(),
  description: Joi.string().min(10).max(500).trim().optional(),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({ 'string.pattern.base': 'Invalid Category ID format' }),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  status: Joi.string().valid('open', 'in progress', 'resolved', 'closed').optional(),
  assignedAgent: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({ 'string.pattern.base': 'Invalid Agent ID format' })
});

module.exports = {
  createTicketSchema,
  updateTicketSchema
};
