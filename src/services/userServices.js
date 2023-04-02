import bcrypt from "bcrypt";
import userRepositories from "../repositories/userRepositories.js";
import errors from "../errors/index.js";
import jwt from "jsonwebtoken";

async function signup({ name, email, password, type, speciality, crm, cpf }) {
  const { rowCount } = await userRepositories.findByEmail(email);
  if (rowCount) throw errors.duplicatedError("email", email);

  if(crm){
    const { rowCount } = await userRepositories.findByCrm(crm);
    if (rowCount) throw errors.duplicatedError("crm", crm);
  }

  if(cpf){
    const { rowCount } = await userRepositories.findByCpf(cpf);
    if (rowCount) throw errors.duplicatedError("cpf", cpf);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  await userRepositories.signup({ name, email, password: hashPassword, type });

  const { rows: [user] } = await userRepositories.findByEmail(email);

  if (type === "doctor") await userRepositories.doctor({user_id: user.id, speciality, crm});
  if (type === "patient") await userRepositories.patient({user_id: user.id, cpf});
}

async function signin({ email, password }) {
  const {
    rowCount,
    rows: [user],
  } = await userRepositories.findByEmail(email);
  if (!rowCount) throw errors.invalidCredentialsError();

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw errors.invalidCredentialsError();

  const data = { user_id: user.id };
  const secretKey = process.env.JWT_SECRET;
  user.token = jwt.sign(data, secretKey);
  delete user.password;
  return user;
}

async function findDoctorByUserId(user_id) {
  return await userRepositories.findDoctorByUserId(user_id);
}

export default {
  signup,
  signin,
  findDoctorByUserId,
};