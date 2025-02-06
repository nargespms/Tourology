import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();
// multer config
import { upload } from "../middleware/multerConfig.js";

router.post(
  "/register",
  upload.single("profilePicture"),
  authController.register
);
router.post("/login", authController.login);

export default router;
