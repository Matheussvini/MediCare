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

const available = joi.object({
    doctor_name: joi.string(),
    date: joi.string(),
    fu: joi.string().min(2).max(2),
    city: joi.string(),
    district: joi.string(),
});

const schedule = joi.object({
    available_id: joi.number().required(),
    patient_id: joi.number().required(),
    time: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
});

export default {
    create,
    confirm,
    available,
    schedule,
};