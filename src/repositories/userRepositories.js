import connectionDB from "../config/database.js";

async function findByEmail(email) {
  return await connectionDB.query(
    `
        SELECT * FROM users WHERE email = $1
    `,
    [email]
  );
}

async function findByCrm(crm) {
  return await connectionDB.query(
    `
        SELECT * FROM doctors WHERE crm = $1
    `,
    [crm]
  );
}

async function findByCpf(cpf) {
  return await connectionDB.query(
    `
        SELECT * FROM patients WHERE cpf = $1
    `,
    [cpf]
  );
}

async function findUserById(user_id) {
  return await connectionDB.query(
    `
        SELECT * FROM users WHERE id = $1
    `,
    [user_id]
  );
}

async function signup({ name, email, password, type }) {
  await connectionDB.query(
    `
        INSERT INTO users (name, email, password, type)
        VALUES ($1, $2, $3, $4)
    `,
    [name, email, password, type]
  );
}

async function doctor({ user_id, speciality, crm }) {
  await connectionDB.query(
    `
            INSERT INTO doctors (user_id, speciality, crm)
            VALUES ($1, $2, $3)
        `,
    [user_id, speciality.toLowerCase(), crm]
  );
}

async function patient({ user_id, cpf }) {
  await connectionDB.query(
    `
            INSERT INTO patients (user_id, cpf)
            VALUES ($1, $2)
        `,
    [user_id, cpf]
  );
}

async function findDoctorByUserId(user_id) {
  return await connectionDB.query(
    `
        SELECT * FROM doctors WHERE user_id = $1
    `,
    [user_id]
  );
}

export default {
  signup,
  findByEmail,
  doctor,
  patient,
  findByCrm,
  findByCpf,
  findUserById,
  findDoctorByUserId
};
