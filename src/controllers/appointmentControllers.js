import appointmentServices from "../services/appointmentServices.js";


async function create (req, res, next) {
  const { doctor_id, fu, city, district, date, start_time, end_time } = req.body;
  try {
    await appointmentServices.create({ doctor_id, fu, city, district, date, start_time, end_time });
    return res.status(201).send({ message: "Successfully created appointment" });
  } catch (err) {
    next(err);
  }
}

export default {
    create,
};