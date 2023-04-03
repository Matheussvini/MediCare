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

async function findByScheduleId(id) {
  return await connectionDB.query(
    `
        SELECT * FROM schedule_appointments WHERE id = $1
    `,
    [id]
  );
}

async function confirm({ id, status }) {
  await connectionDB.query(
    `
        UPDATE schedule_appointments
        SET status = $2
        WHERE id = $1
    `,
    [id, status]
  );
}

async function findAvailable({
  doctor_name,
  date,
  fu,
  city,
  district,
  speciality,
}) {

  let query = `
        SELECT
          a.id,
          a.doctor_id,
          a.fu,
          a.city,
          a.district,
          a.date,
          a.start_time,
          a.end_time,
          d.speciality,
          u.name
        FROM available_appointments a
        JOIN doctors d ON d.id = a.doctor_id
        JOIN users u ON u.id = d.user_id
        WHERE 1 = 1
    `;
  const params = [];

  if (fu) {
    params.push(fu);
    query += ` AND a.fu ILIKE '%' || $${params.length} || '%'`;
  }

  if (city) {
    params.push(city);
    query += ` AND a.city ILIKE '%' || $${params.length} || '%'`;
  }

  if (district) {
    params.push(district);
    query += ` AND a.district ILIKE '%' || $${params.length} || '%'`;
  }

  if (date) {
    params.push(date);
    query += ` AND a.date = $${params.length}`;
  }

  if (doctor_name) {
    params.push(doctor_name);
    query += ` AND u.name ILIKE '%' || $${params.length} || '%'`;
  }

  if (speciality) {
    params.push(speciality);
    query += ` AND d.speciality ILIKE '%' || $${params.length} || '%'`;
  }

  query += `
    ORDER BY a.date, a.start_time ASC`

  const { rows } = await connectionDB.query(query, params);

  return rows;
}

export default {
  create,
  findByDoctorId,
  findByDoctorIdDateAndTime,
  findByScheduleId,
  confirm,
  findAvailable,
};
