import { Types } from "mongoose";
import Tour from "../models/Tour.model.js";
import User from "../models/User.model.js";

class TourService {
  async createTour(userId, tourData) {
    try {
      const newTour = new Tour(tourData);

      await newTour.save();

      return newTour;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create a tour");
    }
  }

  async deleteTour(userId, tourId) {
    try {
      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (tour.host.id.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
      }

      await Tour.deleteOne({ _id: tourId });

      return tour;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to delete tour");
    }
  }

  async updateTour(userId, tourId, tourData) {
    try {
      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (tour.host.id !== userId) {
        throw new Error("Unauthorized");
      }

      await Tour.updateOne({ _id: tourId }, { $set: tourData });

      return tour;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to update tour");
    }
  }

  async getTour(tourId) {
    try {
      const tour = await Tour.findOne({ _id: tourId });

      if (!tour) {
        throw new Error("Tour not found");
      }
      return tour;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get tour");
    }
  }

  async searchTours(query) {
    try {
      const tours = await Tour.find({
        state: "published",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }).sort({ createdAt: -1 });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to search tours");
    }
  }

  async searchNearbyTours(distance, lat, lng) {
    try {
      const tours = await Tour.find({
        state: "published",
        region: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: parseInt(distance, 10),
          },
        },
      }).sort({ createdAt: -1 });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to search nearby tours");
    }
  }

  async getUserFavoriteTours(userId) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      const tours = await Tour.find({
        _id: { $in: user.favoriteTours },
        state: "published",
      });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get user favorite tours");
    }
  }

  async getUserBookedTours(userId) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      const tours = await Tour.find({ _id: { $in: user.bookedTours } })
        .sort({ createdAt: -1 })
        .lean();

      const now = new Date();

      tours.forEach((tour) => {
        const tourDate = new Date(tour.startDate);
        tour.upcoming =
          tourDate >= now &&
          (tour.state === "active" || tour.state === "published");
      });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get user booked tours");
    }
  }

  async getHostTours(userId) {
    try {
      const tours = await Tour.find({ "host.id": userId })
        .sort({ createdAt: -1 })
        .lean();

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get host tours");
    }
  }

  async getTours() {
    try {
      const tours = await Tour.find({ state: "published" })
        .sort({ createdAt: -1 })
        .lean();

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get tours");
    }
  }

  async getFreeTours() {
    try {
      const tours = await Tour.find({ state: "published", paid: false })
        .sort({ createdAt: -1 })
        .lean();
      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get free tours");
    }
  }

  async getOwnedTours(userId) {
    try {
      const tours = await Tour.find({ "host.id": userId })
        .sort({ createdAt: -1 })
        .lean();

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get owned tours");
    }
  }

  async getFollowedTourGuidesTours(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      console.log(user, "user.followingGuides", user.followingGuides);

      const tours = await Tour.find({
        "host.id": { $in: user.followingGuides },
      })
        .sort({ createdAt: -1 })
        .lean();

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get followed tour guides tours");
    }
  }

  async favoriteTour(userId, tourId, unfavorite = false) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (unfavorite) {
        user.favoriteTours = user.favoriteTours.filter(
          (id) => id.toString() !== tourId
        );
      } else {
        user.favoriteTours.push(tourId);
      }

      await user.save();

      return { success: true };
    } catch (err) {
      console.error(err);
      throw new Error("Unable to favorite tour");
    }
  }

  async getTourIsFavorite(userId, tourId) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      return user.favoriteTours.includes(tourId);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get tour is favorite");
    }
  }

  async bookATour(userId, tourId) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      user.bookedTours.push(tourId);

      if (!tour.attendees) {
        tour.attendees = new Map();
      }

      tour.attendees.set(user._id, {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNumber: user.phoneNumber,
        checkedIn: false,
      });

      tour.markModified("attendees");

      console.log("tour.attendees", tour.attendees, user);

      await user.save();
      await tour.save();

      return { success: true };
    } catch (err) {
      console.error(err);
      throw new Error("Unable to book a tour");
    }
  }

  async isBooked(userId, tourId) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      return user.bookedTours.includes(tourId);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to check if tour is booked");
    }
  }

  async upsertFeedback(userId, tourId, rating, description) {
    try {
      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const now = new Date();

      if (!tour.reviews) {
        tour.reviews = new Map();
      }

      tour.reviews.set(userId, {
        date: now,
        id: userId,
        rating: rating,
        description: description,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
        },
      });

      tour.markModified("reviews");

      // calculate average rating
      let totalRating = 0;
      let totalReviews = 0;

      tour.reviews.forEach((review) => {
        totalRating += review.rating;
        totalReviews++;
      });

      tour.rating = totalRating / totalReviews;

      await tour.save();

      return { success: true };
    } catch (err) {
      console.error(err);
      throw new Error("Unable to upsert feedback");
    }
  }

  async getTourUserFeedback(userId, tourId) {
    try {
      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (!tour.reviews?.has(userId.toString())) {
        return null;
      }

      return tour.reviews.get(userId.toString());
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get tour user feedback");
    }
  }

  async userHasCheckedIn(userId, tourId) {
    try {
      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (!tour.attendees?.has(userId.toString())) {
        return false;
      }

      return tour.attendees.get(userId.toString()).checkedIn;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get user has checked in");
    }
  }

  async changeTourState(userId, tourId, state) {
    try {
      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (tour.host.id.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
      }

      if (state === "active") {
        // check if the user has any other active tours
        const activeTours = await Tour.find({
          "host.id": userId,
          state: "active",
        });

        if (activeTours.length > 0) {
          return {
            success: false,
            message: "You can only have one active tour at a time",
          };
        }
      }
      console.log("state", state);
      tour.state = state;

      await tour.save();

      return { success: true };
    } catch (err) {
      console.error(err);
      throw new Error("Unable to change tour state");
    }
  }

  async getActiveTour(userId) {
    try {
      const tour = await Tour.findOne({ "host.id": userId, state: "active" });

      return tour;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get active tour");
    }
  }

  async checkInUser(userId, tourId) {
    try {
      const tour = await Tour.findById(tourId);

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (!tour.attendees?.has(userId.toString())) {
        throw new Error("User not found in attendees");
      }

      tour.attendees.get(userId.toString()).checkedIn = true;
      tour.attendees.get(userId.toString()).checkedInDate = new Date();

      tour.markModified("attendees");

      await tour.save();

      const attendeeData = tour.attendees.get(userId.toString());

      return { success: true, attendee: attendeeData };
    } catch (err) {
      console.error(err);
      throw new Error("Unable to check in user");
    }
  }
}

const tourService = new TourService();
export default tourService;
