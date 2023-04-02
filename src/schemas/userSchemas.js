import joi from "joi";

const signUpDoctor = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  type: joi.string().valid("doctor").required(),
  speciality: joi.string().required(),
  crm: joi
    .string()
    .min(6)
    .max(6)
    .regex(/^\d{6}$/)
    .required(),
});

const signUpPatient = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  type: joi.string().valid("patient").required(),
  cpf: joi
    .string()
    .min(14)
    .max(14)
    .pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/))
    .required(),
});

const signIn = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export default {
  signUpDoctor,
  signUpPatient,
  signIn,
};
