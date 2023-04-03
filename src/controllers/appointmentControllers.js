import errors from "../errors/index.js";
import userRepositories from "../repositories/userRepositories.js";
import appointmentServices from "../services/appointmentServices.js";

async function create(req, res, next) {
  const { fu, city, district, date, start_time, end_time } = req.body;
  const { user } = res.locals;
  try {
    if (user.type !== "doctor") {
      throw errors.invalidCredentialsError(
        "Only doctor users can create appointments"
      );
    }

    const doctor = await userRepositories.findDoctorByUserId(user.id);
    if (!doctor) throw errors.notFoundError({message: `Doctor with user id ${user.id} not found`});

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

async function confirm (req, res, next) {
  const { id } = parseInt(req.params);
  const { user } = res.locals;
  const { status } = req.body;
  try {
    if (user.type !== "doctor") {
      throw errors.invalidCredentialsError(
        "Only doctor users can confirm appointments"
      );
    }

    await appointmentServices.confirm({id, user, status});

    return res
      .status(200)
      .send({ message: `Successfully ${status} appointment` });
  } catch (err) {
    next(err);
  }
}

async function available (req, res, next) {
  const { doctor_name, date, fu, city, district, speciality } = req.query;
  const { user } = res.locals;
  try {
    if (user.type !== "patient") {
      throw errors.invalidCredentialsError(
        "Only patient users can confirm appointments"
      );
    }

    const availables = await appointmentServices.available({doctor_name, date, fu, city, district, speciality});

    return res
      .status(200)
      .send({ availables });
  } catch (err) {
    next(err);
  }
}

export default {
  create,
  confirm,
  available
};
