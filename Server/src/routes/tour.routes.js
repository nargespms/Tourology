import { Router } from "express";
import tourController from "../controllers/tour.controller.js";
import { upload } from "../middleware/multerConfig.js";
import requireAuth from "../middleware/auth.middleware.js";
const router = Router();

router.get('/host/:id', tourController.getToursByHost);
router.get("/user/booked", requireAuth, tourController.userBookedTours);
router.get("/user/checked-in/:id", requireAuth, tourController.userHasCheckedIn);
router.get('/search', tourController.searchTours);
router.get('/nearby', tourController.searchNearbyTours);

router.get('/owned', requireAuth, tourController.getOwnedTours);
router.get('/followed', requireAuth, tourController.getFollowedTourGuidesTours);
router.get('/free', requireAuth, tourController.getFreeTours);
router.get('/favorite', requireAuth, tourController.getFavoriteTours);
router.get('/booked', requireAuth, tourController.getBookedTours);
router.get("/:id", tourController.getTour);
router.get("/", tourController.getTours);

router.post("/:id/favorite", requireAuth, tourController.toggleFavoriteTour);
router.get("/:id/favorite", requireAuth, tourController.getTourIsFavorite);

router.post('/:id/feedback', requireAuth, upload.none(), tourController.upsertFeedback);
router.get('/:id/feedback', requireAuth, tourController.getFeedback);

router.post(
  "/",
  requireAuth,
  upload.any(),
  tourController.createTour
);

router.post('/:id/book', requireAuth, tourController.bookATour);
router.get('/:id/booked', requireAuth, tourController.isBooked);

router.put('/:id', requireAuth, upload.any(), tourController.updateTour);
router.delete('/:id', requireAuth, tourController.deleteTour);

export default router;
