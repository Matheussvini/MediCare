import { Router } from "express";
import userRoutes from "./userRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/appointments", appointmentRoutes);

export default routes;
