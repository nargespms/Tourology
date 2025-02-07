import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tourRoutes from "./tour.routes.js";
import mediaRoutes from "./media.routes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use('/tours', tourRoutes);
router.use('/media', mediaRoutes);

export default router;
