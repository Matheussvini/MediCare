import joi from "joi";

const create = joi.object({
  doctor_id: joi.number().integer().required(),
  fu: joi.string().min(2).max(2).required(),
  city: joi.string().required(),
  district: joi.string().required(),
    // date: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    date: joi.string().required(),
    // date: joi.string().isoDate().custom((value, helpers) => {
    //     if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    //       return helpers.error('any.invalid');
    //     }
    //     return value;
    //   }, 'custom date format'),
  start_time: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
  end_time: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
});

export default {
    create,
};