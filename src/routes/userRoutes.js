import { Router } from "express";
import userControllers from "../controllers/userControllers.js";
import userSchema from "../schemas/userSchemas.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";



const userRoutes = Router();

userRoutes.post("/signup/doctor", validateSchema(userSchema.signUpDoctor), userControllers.signup);
userRoutes.post("/signup/patient", validateSchema(userSchema.signUpPatient), userControllers.signup);
userRoutes.post("/signin", validateSchema(userSchema.signIn), userControllers.signin);

export default userRoutes;