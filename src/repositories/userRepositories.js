import connectionDB from "../config/database.js";

async function findByEmail(email) {
  return await connectionDB.query(
    `
        SELECT * FROM users WHERE email = $1
    `,
    [email]
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

export default {
    signup,
    findByEmail
}