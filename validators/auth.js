const Joi = require('@hapi/joi');

const Validators = {
  createRole: function (user) {
    const schema = Joi.object({
      name: Joi.string()
        .trim()
        .required()
        .valid('admin', 'worker')
        .max(40)
        .messages({
          'any.required': 'Role name is required.',
          'string.empty': 'Role name is not allowed to be empty!',
        }),
    });

    return schema.validate(user);
  },

  createUser: function (user) {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(2).max(25).required(),
      lastName: Joi.string().trim().min(2).max(25).required(),
      email: Joi.string().email().trim().min(2).max(25).required(),
      phone: Joi.string().trim().min(2).max(25).allow(null, ''),
      password: Joi.string().trim().min(6).max(25).required(),
      roleId: Joi.number().required(),
    });

    return schema.validate(user);
  },

  auth: function (user) {
    const schema = Joi.object({
      email: Joi.string().trim().min(2).max(25).required(),
      password: Joi.string().trim().min(2).max(25).required(),
    });

    return schema.validate(user);
  },
};
module.exports.Validators = Validators;
