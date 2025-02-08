import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { upload } from "../middleware/multerConfig.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.get('/tourGuide/:tourGuideId', requireAuth, usersController.getTourGuideInfo);
router.post('/tourGuide/:tourGuideId/:follow', requireAuth, usersController.followTourGuide);


export default router;
