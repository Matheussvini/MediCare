import connectionDB from "../config/database.js";

async function create({
  doctor_id,
  fu,
  city,
  district,
  date,
  start_time,
  end_time,
}) {
  await connectionDB.query(
    `
        INSERT INTO available_appointments (doctor_id, fu, city, district, date, start_time, end_time)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      doctor_id,
      fu.toUpperCase(),
      city.toLowerCase(),
      district.toLowerCase(),
      date,
      start_time,
      end_time,
    ]
  );
}

async function findByDoctorId(doctor_id) {
  return await connectionDB.query(
    `
        SELECT * FROM doctors WHERE id = $1
    `,
    [doctor_id]
  );
}

async function findByDoctorIdDateAndTime({
  doctor_id,
  date,
  start_time,
  end_time,
}) {
  return await connectionDB.query(
    `
        SELECT *
        FROM available_appointments
        WHERE doctor_id = $1
        AND date = $2
        AND ((start_time BETWEEN $3 AND $4)
         OR (end_time BETWEEN $3 AND $4)
         OR (start_time < $3 AND end_time > $4))
    `,
    [doctor_id, date, start_time, end_time]
  );
}

export default {
  create,
  findByDoctorId,
  findByDoctorIdDateAndTime,
};
