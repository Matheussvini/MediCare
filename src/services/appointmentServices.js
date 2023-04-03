import errors from "../errors/index.js";
import appointmentRepositories from "../repositories/appointmentRepositories.js";
import moment from "moment";
import momentTz from "moment-timezone";
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

async function confirm({ schedule_id, user, status }) {
  const {
    rows: [schedule],
  } = await appointmentRepositories.findByScheduleId(schedule_id);
  if (!schedule) {
    throw errors.notFoundError({
      message: `Schedule with id ${schedule_id} not found`,
    });
  }

  const {
    rows: [doctor],
  } = await userRepositories.findDoctorByUserId(user.id);
  if (doctor.id !== schedule.doctor_id) {
    throw errors.invalidCredentialsError({
      message: `This appointment does not belong to doctor with id ${doctor.id}`,
    });
  }
  if (!doctor) {
    throw errors.notFoundError({
      message: `Doctor with user id ${user.id} not found`,
    });
  }

  if (schedule.status !== "pending") {
    throw errors.conflictError({
      message: `This appointment is already ${schedule.status}`,
    });
  }

  await appointmentRepositories.confirm({ schedule_id, status });
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

  const now = momentTz().utc();
  const brTimezone = "America/Sao_Paulo";
  const brNow = now.tz(brTimezone);

  await appointmentRepositories.deleteOlderThanToday(brNow);

  const search = await appointmentRepositories.findAvailable({
    doctor_name,
    date,
    fu,
    city,
    district,
    speciality,
  });

  const arrAvailables = search.map((available) => {
    const { start_time, end_time } = available;
    const startTimeMoment = moment(start_time, "HH:mm:ss");
    const endTimeMoment = moment(end_time, "HH:mm:ss");
    const times = [];

    while (startTimeMoment.isBefore(endTimeMoment)) {
      times.push(startTimeMoment.format("HH:mm"));
      startTimeMoment.add(20, "minutes");
    }

    return {
      ...available,
      times,
    };
  });

  const result = [];

  for (const appointment of arrAvailables) {
    const { rows: schedules } =
      await appointmentRepositories.findSchedulesByAvailableId(appointment.id);

    appointment.times = appointment.times.filter((time, i) => {
      const isScheduled = schedules?.some(
        (schedule) => schedule.time.slice(0, -3) === time
      );
      return !isScheduled;
    });

    if (appointment.times.length > 0) {
      result.push(appointment);
    }
  }

  return result;
}

async function marking({ available_id, time, user }) {
  const {
    rows: [available],
    rowCount,
  } = await appointmentRepositories.findByAvailableIdAndTime({
    available_id,
    time,
  });
  if (!rowCount) {
    throw errors.notFoundError({
      message: `Available with id ${available_id} not found or the time ${time} is not between start_time and end_time`,
    });
  }
  const {
    rows: [patient],
  } = await userRepositories.findPatientByUserId(user.id);

  const search = await appointmentRepositories.findScheduleByTime({
    available_id,
    time,
  });
  if (search.rowCount) {
    throw errors.conflictError(
      `Appointment already exists in this time ${time} for this doctor`
    );
  }

  const { rows: schedules } =
    await appointmentRepositories.findSchedulesByAvailableIdAndPatientId({
      available_id,
      patient_id: patient.id,
    });
  if (schedules.length > 1) {
    throw errors.conflictError(
      `Pacient with id ${patient.id} already have an appointment with this doctor on this day`
    );
  }

  await appointmentRepositories.marking({
    available_id,
    doctor_id: available.doctor_id,
    patient_id: patient.id,
    time,
  });
}

async function mySchedules(params, user) {
  if (user.type === "doctor") {
    const {
      rows: [doctor],
    } = await userRepositories.findDoctorByUserId(user.id);
    params.doctor_id = doctor.id;

    const schedules = await appointmentRepositories.findSchedules(params, user);
    if (!schedules) {
      throw errors.notFoundError(`Schedules with this params not found`);
    }
    return schedules;
  }

  if (user.type === "patient") {
    const {
      rows: [patient],
    } = await userRepositories.findPatientByUserId(user.id);
    params.patient_id = patient.id;

    const schedules = await appointmentRepositories.findSchedules(params, user);
    if (!schedules) {
      throw errors.notFoundError(`Schedules with this params not found`);
    }
    return schedules;
  }
}

async function performed(user) {
  const now = momentTz().utc();
  const brTimezone = "America/Sao_Paulo";
  const brNow = now.tz(brTimezone);

  const { rows: performed } = await appointmentRepositories.findPerformed({
    user,
    brNow,
  });
  console.log("performed", performed);

  return performed;
}

export default {
  create,
  confirm,
  available,
  marking,
  mySchedules,
  performed,
};
