import { Router } from "express";
import userControllers from "../controllers/userControllers.js";
import { userSchema } from "../schemas/userSchema.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";



const userRoutes = Router();

userRoutes.post("/signup", validateSchema(userSchema),  userControllers.signup);
userRoutes.post("/signin", userControllers.signin);

export default userRoutes;