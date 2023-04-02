import errors from "../errors/index.js";
import appointmentRepositories from "../repositories/appointmentRepositories.js";
import moment from "moment";

async function create({doctor_id, fu, city, district, date, start_time, end_time}) {

  const now = moment();
  const appointmentDate = moment(date, "YYYY-MM-DD");
  const appointmentStart = moment(
    `${date} ${start_time}`,
    "YYYY-MM-DD HH:mm:ss"
  );
  const appointmentEnd = moment(`${date} ${end_time}`, "YYYY-MM-DD HH:mm:ss");

  console.log(now, start_time, end_time, appointmentDate, appointmentEnd);

  if ( !appointmentDate.isValid() || !appointmentStart.isValid() || !appointmentEnd.isValid()) {
    throw errors.conflictError("Invalid date or time");
  }

  if ( appointmentDate.isBefore(now) || appointmentStart.isBefore(now) || appointmentEnd.isBefore(now)) {
    throw errors.conflictError("Appointment date must be in the future");
  }

  if ( appointmentEnd.isBefore(appointmentStart)) {
    throw errors.conflictError("Appointment end time must be after start time");
  }

  const { rows } = await appointmentRepositories.findByDoctorIdDateAndTime({
    doctor_id,
    date,
    start_time,
    end_time,
  });
  if (rows.length) {
    throw errors.conflictError(
      "Appointment already exists in this time interval for this doctor"
    );
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

export default {
  create,
};
