import Tour from "../models/Tour.model.js";

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
      const tour = await Tour.findOne({ _id: tourId });

      if (!tour) {
        throw new Error("Tour not found");
      }

      if (tour.host.id !== userId) {
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
      const tour = await Tour.findOne({ _id: tourId });

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

  async getUserFavoriteTours(userId) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      const tours = await Tour.find({ _id: { $in: user.favoriteTours }, status: "published" });

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

      const tours = await Tour.find({ _id: { $in: user.bookedTours }, status: "published" });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get user booked tours");
    }
  }

  async getHostTours(userId) {
    try {
      const tours = await Tour.find({ "host.id": userId });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get host tours");
    }
  }

  async getTours() {
    try {
      const tours = await Tour.find({ status: "published" });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get tours");
    }
  }

  async getOwnedTours(userId) {
    try {
      const tours = await Tour.find({ "host.id": userId });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get owned tours");
    }
  }

  async getFollowedTourGuidesTours(userId) {
    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        throw new Error("User not found");
      }

      const tours = await Tour.find({ "host.id": { $in: user.followingGuides }, status: "published" });

      return tours;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to get followed tour guides tours");
    }
  }

}

const tourService = new TourService();
export default tourService;