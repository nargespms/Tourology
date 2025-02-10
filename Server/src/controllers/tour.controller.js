import tourService from "../services/tour.service.js";
import { parseFiles } from "../utils/parseFiles.js";

const createTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourData = JSON.parse(req.body.data);

    // add files data to tourData
    if (req.files) {
      console.log("files", parseFiles(req.files));
      Object.entries(parseFiles(req.files)).forEach(([key, files]) => {
        if (key === "photos") {
          tourData.photos = files.map((file) => file.filename);
        } else {
          tourData.stops[key].photo = files[0].filename;
        }
      });
    }

    const newTour = await tourService.createTour(userId, tourData);

    res.json(newTour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;

    const deletedTour = await tourService.deleteTour(userId, tourId);

    res.json(deletedTour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const searchTours = async (req, res) => {
  try {
    const query = req.query.q;

    const tours = await tourService.searchTours(query);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const searchNearbyTours = async (req, res) => {
  try {
    const query = req.query;
    const tours = await tourService.searchNearbyTours(
      query.length,
      query.lat,
      query.lng
    );

    return res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;
    const tourData = req.body;

    // add files data to tourData
    if (req.files) {
      Object.entries(parseFiles(req.files)).forEach(([key, files]) => {
        if (key === "photos") {
          if (!tourData.photos) {
            tourData.photos = [];
          }
          tourData.photos = tourData.photos.concat(
            files.map((file) => file.filename)
          );
        } else {
          if (!tourData.stops[key].photo) {
            tourData.stops[key].photo = [];
          }

          tourData.stops[key].photo = tourData.stops[key].photo.concat(
            files.map((file) => file.filename)
          );
        }
      });
    }

    const updatedTour = await tourService.updateTour(userId, tourId, tourData);

    res.json(updatedTour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getTour = async (req, res) => {
  try {
    const tourId = req.params.id;

    const tour = await tourService.getTour(tourId);

    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getTours = async (req, res) => {
  try {
    const tours = await tourService.getTours();

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getToursByHost = async (req, res) => {
  try {
    const hostId = req.params.id;
    const tours = await tourService.getHostTours(hostId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getFollowedTourGuidesTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getFollowedTourGuidesTours(userId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getFreeTours = async (req, res) => {
  try {
    const tours = await tourService.getFreeTours();

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getFavoriteTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getUserFavoriteTours(userId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getBookedTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getUserBookedTours(userId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getOwnedTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getOwnedTours(userId);
    console.log("tours", tours);
    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getTourIsFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;

    const isFavorite = await tourService.getTourIsFavorite(userId, tourId);

    res.json(isFavorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const toggleFavoriteTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;
    const unFavorite = req.query.unfavorite === "1";

    const result = await tourService.favoriteTour(userId, tourId, unFavorite);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const bookATour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;

    const result = await tourService.bookATour(userId, tourId);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const isBooked = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;

    const result = await tourService.isBooked(userId, tourId);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const userBookedTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getUserBookedTours(userId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const upsertFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;
    console.log("req.body", req.body);
    const result = await tourService.upsertFeedback(
      userId,
      tourId,
      req.body.rating,
      req.body.feedback
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getFeedback = async (req, res) => {
  try {
    const tourId = req.params.id;
    const userId = req.user.id;
    const feedback = await tourService.getTourUserFeedback(userId, tourId);

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const userHasCheckedIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;

    const result = await tourService.userHasCheckedIn(userId, tourId);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const changeTourState = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourId = req.params.id;
    const state = req.body.state;

    const result = await tourService.changeTourState(userId, tourId, state);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getActiveTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tour = await tourService.getActiveTour(userId);

    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const checkInUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const tourId = req.params.id;

    const result = await tourService.checkInUser(userId, tourId);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default {
  createTour,
  deleteTour,
  updateTour,
  getTour,
  searchTours,
  getTours,
  getToursByHost,
  getFollowedTourGuidesTours,
  getFavoriteTours,
  getBookedTours,
  getOwnedTours,
  getTourIsFavorite,
  toggleFavoriteTour,
  bookATour,
  isBooked,
  userBookedTours,
  upsertFeedback,
  getFeedback,
  userHasCheckedIn,
  getFreeTours,
  searchNearbyTours,
  changeTourState,
  getActiveTour,
  checkInUser,
};
