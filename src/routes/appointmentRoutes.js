import { Router } from "express";
import appointmentControllers from "../controllers/appointmentControllers.js";
import appointmentSchema from "../schemas/appointmentSchemas.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const appointmentRoutes = Router();

appointmentRoutes.post(
  "/create",
  authMiddleware.authValidation,
  validateSchema(appointmentSchema.create),
  appointmentControllers.create
);

appointmentRoutes.post(
  "/confirm/:id",
    authMiddleware.authValidation,
  validateSchema(appointmentSchema.confirm),
  appointmentControllers.confirm
);

export default appointmentRoutes;
