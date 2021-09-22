const Joi = require('joi');

const constants = require('../constants');

const { NAME_MIN, NAME_MAX, PASSWORD_MAX, PASSWORD_MIN} = constants;

const schema = Joi.object().keys({
  username: Joi.string()
    .min(NAME_MIN)
    .max(NAME_MAX)
    .required(),
  email: Joi.string().email({ minDomainAtoms: 2 }),
});

const schemaPass = Joi.object().keys({
  newpass: Joi.string()
    .min(PASSWORD_MIN)
    .max(PASSWORD_MAX)
    .required(),
  current: Joi.string().required(),
});

async function validateRegisterPayload(req, res, next) {
  let payloadValidation;
  try {
    payloadValidation = await Joi.validate(req.body, schema, { abortEarly: false });
  } catch (validateRegisterError) {
    payloadValidation = validateRegisterError;
  }
  const { details } = payloadValidation;
  let errors;
  if (details) {
    errors = {};
    details.forEach(errorDetail => {
      const {
        message,
        path: [key],
        type,
      } = errorDetail;
      const errorType = type.split('.')[1];
      errors[key] = constants[`${key.toUpperCase()}_${errorType.toUpperCase()}_ERROR`] || message;
    });
  }

  if (errors) {
    req.session.messages = { errors };
    return res.status(400).redirect('/profile');
  }
  return next();
}

async function validateChangePasswordPayload(req, res, next) {
  let payloadValidation;
  try {
    payloadValidation = await Joi.validate(req.body, schemaPass, { abortEarly: false });
  } catch (validateRegisterError) {
    payloadValidation = validateRegisterError;
  }
  const { details } = payloadValidation;
  let errors;
  if (details) {
    errors = {};
    details.forEach(errorDetail => {
      const {
        message,
        path: [key],
        type,
      } = errorDetail;
      const errorType = type.split('.')[1];
      errors[key] = constants[`${key.toUpperCase()}_${errorType.toUpperCase()}_ERROR`] || message;
    });
  }
  if (errors) {
    req.session.messages = { errors };
    return res.status(400).redirect('/profile');
  }
  return next();
}

module.exports = {validateRegisterPayload, validateChangePasswordPayload};
