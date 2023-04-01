import { Router } from "express";
import userRoutes from "./userRoutes.js";

const routes = Router();

routes.use("/users", userRoutes);
// routes.use("/patients", patientRoutes);
// routes.use("/doctors", doctorRoutes);
// routes.use("/appointmentRoutes", appointmentRoutes);

export default routes;
