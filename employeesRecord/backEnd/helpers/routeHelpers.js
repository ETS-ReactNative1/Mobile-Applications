const Joi = require("@hapi/joi");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const { name, email, password } = req.body;
      let result;
      if (name && email) {
        result = schema.validate({ name, email, password });
      } else {
        result = schema.validate({ email, password });
      }

      if (result.error) {
        return res.status(400).send({ error: result.error.details[0].message });
      }

      // we use req.value.body instead of req.body
      //   if (!req.value) {
      //     req.value = {};
      //   }
      //   req.value["body"] = result.value;

      req.body = { ...req.body, ...result.value };
      next();
    };
  },
  schemas: {
    signUpAuthSchema: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
    signInAuthSchema: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  },
};
