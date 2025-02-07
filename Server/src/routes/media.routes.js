import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { upload } from "../middleware/multerConfig.js";
import mediaController from "../controllers/media.controller.js";

const router = Router();

router.get(
  "/:filename",
  mediaController.getMedia
);


export default router;
