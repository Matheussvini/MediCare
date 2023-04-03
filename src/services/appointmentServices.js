import errors from "../errors/index.js";
import appointmentRepositories from "../repositories/appointmentRepositories.js";
import moment from "moment";
import userRepositories from "../repositories/userRepositories.js";

async function create({
  doctor_id,
  fu,
  city,
  district,
  date,
  start_time,
  end_time,
}) {
  const now = moment();
  const appointmentDate = moment(date, "YYYY-MM-DD");
  const appointmentStart = moment(
    `${date} ${start_time}`,
    "YYYY-MM-DD HH:mm:ss"
  );
  const appointmentEnd = moment(`${date} ${end_time}`, "YYYY-MM-DD HH:mm:ss");

  if (
    !appointmentDate.isValid() ||
    !appointmentStart.isValid() ||
    !appointmentEnd.isValid()
  ) {
    throw errors.conflictError({ message: "Invalid date or time" });
  }

  if (
    appointmentDate.isBefore(now) ||
    appointmentStart.isBefore(now) ||
    appointmentEnd.isBefore(now)
  ) {
    throw errors.conflictError({
      message: "Appointment date must be in the future",
    });
  }

  if (appointmentEnd.isBefore(appointmentStart)) {
    throw errors.conflictError({
      message: "Appointment end time must be after start time",
    });
  }

  const { rows } = await appointmentRepositories.findByDoctorIdDateAndTime({
    doctor_id,
    date,
    start_time,
    end_time,
  });
  if (rows.length) {
    throw errors.conflictError({
      message:
        "Appointment already exists in this time interval for this doctor",
    });
  }

  await appointmentRepositories.create({
    doctor_id,
    fu,
    city,
    district,
    date,
    start_time,
    end_time,
  });
}

async function confirm({ id, user, status }) {
  const schedule = await appointmentRepositories.findByScheduleId(id);
  if (!schedule) {
    throw errors.notFoundError({ message: `Schedule with id ${id} not found` });
  }

  const doctor = await userRepositories.findDoctorByUserId(user.id);
  if (!doctor) {
    throw errors.notFoundError({
      message: `Doctor with user id ${user.id} not found`,
    });
  }

  await appointmentRepositories.confirm({ id, status });
}

async function available({
  doctor_name,
  date,
  fu,
  city,
  district,
  speciality,
}) {
  if (date) {
    const appointmentDate = moment(date, "YYYY-MM-DD");

    if (!appointmentDate.isValid()) {
      throw errors.conflictError({ message: "Invalid date" });
    }
  }

  const search = await appointmentRepositories.findAvailable({
    doctor_name,
    date,
    fu,
    city,
    district,
    speciality,
  });

  const result = search.map((available) => {
    const { start_time, end_time } = available;
    const startTimeMoment = moment(start_time, 'HH:mm:ss');
    const endTimeMoment = moment(end_time, 'HH:mm:ss');
    const times = [];

    while (startTimeMoment.isBefore(endTimeMoment)) {
      times.push(startTimeMoment.format('HH:mm'));
      startTimeMoment.add(20, 'minutes');
    }

    return {
      ...available,
      times,
    };
  });

  return result;

}

export default {
  create,
  confirm,
  available,
};
