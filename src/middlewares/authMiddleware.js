import errors from "../errors/index.js";
import userRepositories from "../repositories/userRepositories.js";
import jwt from "jsonwebtoken";

async function authValidation(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const secretKey = process.env.JWT_SECRET;

    if (!token) throw errors.unauthorizedError({ message: "Token not found" });

    const data = jwt.verify(token, secretKey);

    const {
      rows: [user],
    } = await userRepositories.findUserById(data.user_id);

    if (!user) {
      throw errors.notFoundError({
        message: `User with id ${data.user_id} not found`,
      });
    }

    delete user.password;
    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export default {
  authValidation,
};
