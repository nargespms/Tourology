import tourService from "../services/tour.service.js";
import { parseFiles } from "../utils/parseFiles.js";

const createTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourData = JSON.parse(req.body.data);

    // add files data to tourData
    if (req.files) {
      console.log('files', parseFiles(req.files));
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
          tourData.photos = tourData.photos.concat(files.map((file) => file.filename));
        } else {

          if (!tourData.stops[key].photo) {
            tourData.stops[key].photo = [];
          }

          tourData.stops[key].photo = tourData.stops[key].photo.concat(files.map((file) => file.filename))
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
}

const getTours = async (req, res) => {
  try {
    const tours = await tourService.getTours();

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getToursByHost = async (req, res) => {
  try {
    const hostId = req.params.id;
    const tours = await tourService.getHostTours(hostId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getFollowedTourGuidesTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getFollowedTourGuidesTours(userId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getFavoriteTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getUserFavoriteTours(userId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getBookedTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getUserBookedTours(userId);

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getOwnedTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await tourService.getOwnedTours(userId);
    console.log('tours', tours);
    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


export default {
  createTour,
  deleteTour,
  updateTour,
  getTour,
  getTours,
  getToursByHost,
  getFollowedTourGuidesTours,
  getFavoriteTours,
  getBookedTours,
  getOwnedTours,
}