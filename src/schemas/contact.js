import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must not exceed 20 characters',
    'any.required': 'Name is required'
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Phone number must be at least 3 characters long',
    'string.max': 'Phone number must not exceed 20 characters',
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address'
  }),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string().valid('work', 'home', 'personal').default('personal').messages({
    'any.only': 'Contact type must be one of: work, home, personal'
  })
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must not exceed 20 characters'
  }),
  phoneNumber: Joi.string().min(3).max(20).optional().messages({
    'string.min': 'Phone number must be at least 3 characters long',
    'string.max': 'Phone number must not exceed 20 characters'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address'
  }),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional().messages({
    'any.only': 'Contact type must be one of: work, home, personal'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
}); 