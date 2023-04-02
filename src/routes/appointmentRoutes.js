import { Router } from "express";
import appointmentControllers from "../controllers/appointmentControllers.js";
import appointmentSchema from "../schemas/appointmentSchemas.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";

const appointmentRoutes = Router();

appointmentRoutes.post("/create", validateSchema(appointmentSchema.create), appointmentControllers.create);


export default appointmentRoutes;