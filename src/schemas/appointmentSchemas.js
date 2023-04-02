import joi from "joi";

const create = joi.object({
  fu: joi.string().min(2).max(2).required(),
  city: joi.string().required(),
  district: joi.string().required(),
  date: joi.string().required(),
  start_time: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
  end_time: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
});

const confirm = joi.object({
    status: joi.string().valid("confirmed", "canceled").required(),
});

export default {
    create,
    confirm,
};