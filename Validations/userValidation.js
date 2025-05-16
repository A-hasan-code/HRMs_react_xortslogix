const Joi = require('joi');

const createUserSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  phone_number: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow('', null),
  department: Joi.string().valid('Graphics', 'Business Officer', 'Development', 'GHL').required(),
  designation: Joi.string().valid('Senior', 'Junior', 'Team Lead', 'Head of Department', 'Intern').required(),
  role: Joi.string().valid('employee','admin').default('employee'),
  profile_picture: Joi.string().uri().optional().allow('', null),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateUserSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100).optional(),
  email: Joi.string().email().lowercase().optional(),
  password: Joi.string().min(6).optional(),
  phone_number: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow('', null),
  department: Joi.string().valid('Graphics', 'Business Officer', 'Development', 'GHL').optional(),
  designation: Joi.string().valid('Senior', 'Junior', 'Team Lead', 'Head of Department', 'Intern').optional(),
  role: Joi.string().valid('employee', 'admin').optional(),
  profile_picture: Joi.string().uri().optional().allow('', null),
  status: Joi.string().valid('active', 'inactive').optional()
});

module.exports = {
  createUserSchema,
  updateUserSchema
};
