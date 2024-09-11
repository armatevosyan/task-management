const Joi = require('@hapi/joi');

const Validators = {
  createColumn: function (user) {
    const schema = Joi.object({
      title: Joi.string().trim().required().max(40),
      slug: Joi.string().trim().required().max(40),
    });

    return schema.validate(user);
  },
  createTicket: function (user) {
    const schema = Joi.object({
      title: Joi.string().trim().required().max(40),
      columnId: Joi.number().required().max(40),
      description: Joi.string().trim().allow(null, ''),
      status: Joi.string().trim().allow(null, ''),
      dueDate: Joi.string().trim().required().max(40),
      priority: Joi.string()
        .valid('low', 'medium', 'high')
        .trim()
        .required()
        .max(40),
      userId: Joi.number().allow(null, '').max(40),
    });

    return schema.validate(user);
  },
};
module.exports.Validators = Validators;
