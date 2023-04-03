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

async function confirm({ schedule_id, status }) {
  await connectionDB.query(
    `
        UPDATE schedule_appointments
        SET status = $2
        WHERE id = $1
    `,
    [schedule_id, status]
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
          u.name AS doctor_name,
          a.fu,
          a.city,
          a.district,
          a.date,
          a.start_time,
          a.end_time,
          d.speciality
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
    ORDER BY a.date, a.start_time ASC`;

  const { rows } = await connectionDB.query(query, params);

  return rows;
}

async function findByAvailableIdAndTime({ available_id, time }) {
  return await connectionDB.query(
    `
        SELECT *
        FROM available_appointments
        WHERE id = $1
        AND ($2 BETWEEN start_time AND end_time)
    `,
    [available_id, time]
  );
}

async function findScheduleByTime({ available_id, time }) {
  return await connectionDB.query(
    `
        SELECT *
        FROM schedule_appointments
        WHERE available_id = $1
        AND time = $2
    `,
    [available_id, time]
  );
}

async function marking({ available_id, doctor_id, patient_id, time }) {
  await connectionDB.query(
    `
        INSERT INTO schedule_appointments (available_id, doctor_id, patient_id, time)
        VALUES ($1, $2, $3, $4)
    `,
    [available_id, doctor_id, patient_id, time]
  );
}

async function findSchedulesByAvailableId(available_id) {
  return await connectionDB.query(
    `
        SELECT *
        FROM schedule_appointments
        WHERE available_id = $1
    `,
    [available_id]
  );
}

async function findSchedulesByAvailableIdAndPatientId({
  available_id,
  patient_id,
}) {
  return await connectionDB.query(
    `
        SELECT *
        FROM schedule_appointments
        WHERE available_id = $1
        AND patient_id = $2
    `,
    [available_id, patient_id]
  );
}

async function findSchedules(params, user) {
  const {
    doctor_name,
    doctor_id,
    patient_name,
    patient_id,
    speciality,
    date,
    fu,
    city,
    district,
    status,
  } = params;

  let query = `
        SELECT
          s.id,
          s.available_id,
          s.doctor_id,
          s.patient_id,
          s.time,
          s.status,
          u.name AS doctor_name,
          u2.name AS patient_name,
          d.speciality,
          a.fu,
          a.city,
          a.district,
          a.date
        FROM schedule_appointments s
        JOIN available_appointments a ON a.id = s.available_id
        JOIN doctors d ON d.id = s.doctor_id
        JOIN patients p ON p.id = s.patient_id
        JOIN users u ON u.id = d.user_id
        JOIN users u2 ON u2.id = p.user_id
        WHERE (u.id = $1 OR u2.id = $1)
    `;
  const arrDependencies = [user.id];

  if (fu) {
    arrDependencies.push(fu);
    query += ` AND a.fu ILIKE '%' || $${arrDependencies.length} || '%'`;
  }

  if (city) {
    arrDependencies.push(city);
    query += ` AND a.city ILIKE '%' || $${arrDependencies.length} || '%'`;
  }

  if (district) {
    arrDependencies.push(district);
    query += ` AND a.district ILIKE '%' || $${arrDependencies.length} || '%'`;
  }

  if (date) {
    arrDependencies.push(date);
    query += ` AND a.date = $${arrDependencies.length}`;
  }

  if (doctor_name) {
    arrDependencies.push(doctor_name);
    query += ` AND u.name ILIKE '%' || $${arrDependencies.length} || '%'`;
  }

  if (doctor_id) {
    arrDependencies.push(doctor_id);
    query += ` AND s.doctor_id = $${arrDependencies.length}`;
  }

  if (patient_name) {
    arrDependencies.push(patient_name);
    query += ` AND u2.name ILIKE '%' || $${arrDependencies.length} || '%'`;
  }

  if (patient_id) {
    arrDependencies.push(patient_id);
    query += ` AND s.patient_id = $${arrDependencies.length}`;
  }

  if (speciality) {
    arrDependencies.push(speciality);
    query += ` AND d.speciality ILIKE '%' || $${arrDependencies.length} || '%'`;
  }

  if (status) {
    arrDependencies.push(status);
    query += ` AND s.status = $${arrDependencies.length}`;
  }

  query += `
    ORDER BY a.date, a.start_time ASC`;

  const { rows } = await connectionDB.query(query, arrDependencies);

  return rows;
}

async function deleteOlderThanToday(brNow) {
  const query = `
    DELETE FROM available_appointments
    WHERE
      date < $1 OR
      (date = $1 AND end_time < $2)
  `;
  const values = [brNow.format("YYYY-MM-DD"), brNow.format("HH:mm:ss")];

  await connectionDB.query(query, values);
}

async function findPerformed({ user, brNow }) {
  return await connectionDB.query(
    `
      SELECT
        s.id,
        s.available_id,
        s.doctor_id,
        u.name AS doctor_name,
        s.patient_id,
        u2.name AS patient_name,
        s.time,
        s.status,
        d.speciality,
        a.fu,
        a.city,
        a.district,
        a.date
      FROM schedule_appointments s
      JOIN available_appointments a ON a.id = s.available_id
      JOIN doctors d ON d.id = s.doctor_id
      JOIN patients p ON p.id = s.patient_id
      JOIN users u ON u.id = d.user_id
      JOIN users u2 ON u2.id = p.user_id
      WHERE (u.id = $1 OR u2.id = $1)
      AND s.status = 'confirmed'
      AND a.date < $2
      ORDER BY a.date, a.start_time ASC
    `,
    [user.id, brNow.format("YYYY-MM-DD")]
  );
}

export default {
  create,
  findByDoctorIdDateAndTime,
  findByScheduleId,
  confirm,
  findAvailable,
  findByAvailableIdAndTime,
  findScheduleByTime,
  marking,
  findSchedulesByAvailableId,
  findSchedulesByAvailableIdAndPatientId,
  findSchedules,
  deleteOlderThanToday,
  findPerformed,
};
