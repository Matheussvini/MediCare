import errors from "../errors/index.js";
import appointmentServices from "../services/appointmentServices.js";
import userServices from "../services/userServices.js";

async function create(req, res, next) {
  const { fu, city, district, date, start_time, end_time } = req.body;
  const { user } = res.locals;
  try {
    if (user.type !== "doctor") {
      throw errors.invalidCredentialsError(
        "Only doctor users can create appointments"
      );
    }

    const doctor = await userServices.findDoctorByUserId(user.id);
    if (!doctor) throw errors.doctorNotFound(user.id);

    await appointmentServices.create({
      doctor_id: doctor.id,
      fu,
      city,
      district,
      date,
      start_time,
      end_time,
    });
    return res
      .status(201)
      .send({ message: "Successfully created appointment" });
  } catch (err) {
    next(err);
  }
}

export default {
  create,
};
