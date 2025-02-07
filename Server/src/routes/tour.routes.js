import { Router } from "express";
import tourController from "../controllers/tour.controller.js";
import { upload } from "../middleware/multerConfig.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.get('/host/:id', tourController.getToursByHost);

router.get('/owned', requireAuth, tourController.getOwnedTours);
router.get('/followed', requireAuth, tourController.getFollowedTourGuidesTours);
router.get('/favorite', requireAuth, tourController.getFavoriteTours);
router.get('/booked', requireAuth, tourController.getBookedTours);
router.get("/:id", tourController.getTour);
router.get("/", tourController.getTours);


router.post(
  "/",
  requireAuth,
  upload.any(),
  tourController.createTour
);


router.put('/:id', requireAuth, upload.any(), tourController.updateTour);
router.delete('/:id', requireAuth, tourController.deleteTour);

export default router;
