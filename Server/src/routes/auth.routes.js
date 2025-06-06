import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { upload } from "../middleware/multerConfig.js";

const router = Router();

router.post(
  "/register",
  upload.single("profilePicture"),
  authController.register
);

router.post("/login", authController.login);

export default router;
