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
          'any.required': 'Role is required.',
          'string.empty': 'Role is not allowed to be empty!',
        }),
    });

    return schema.validate(user);
  },
};
module.exports.Validators = Validators;
