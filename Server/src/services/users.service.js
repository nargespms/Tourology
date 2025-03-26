import User from "../models/User.model.js";

class UsersService {
  async getTourGuideInfo(userId, tourGuideId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { error: "User not found" };
      }

      const tourGuide = await User.findById(tourGuideId);

      if (!tourGuide) {
        return { error: "Tour guide not found" };
      }

      return {
        id: tourGuide._id,
        firstName: tourGuide.firstName,
        lastName: tourGuide.lastName,
        profileName: tourGuide.profileName,
        profilePicture: tourGuide.profilePicture,
        bio: tourGuide.bio,
        languages: tourGuide.languages,
        skills: tourGuide.skills,
        yearsOfExperience: tourGuide.yearsOfExperience,
        numberOfFollowers: tourGuide.numberOfFollowers,
        followed: user.followingGuides.includes(tourGuideId),
      };
    } catch (err) {
      console.error(err);
      return { error: "Server error" };
    }
  }

  async followTourGuide(userId, tourGuideId, unfollow = false) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { error: "User not found" };
      }

      const tourGuide = await User.findById(tourGuideId);

      if (!tourGuide) {
        return { error: "Tour guide not found" };
      }

      if (unfollow) {
        user.followingGuides = user.followingGuides.filter(
          (id) => id.toString() !== tourGuideId
        );
        tourGuide.numberOfFollowers--;
      } else {
        user.followingGuides.push(tourGuideId);
        tourGuide.numberOfFollowers++;
      }

      await user.save();
      await tourGuide.save();

      return { success: true };
    } catch (err) {
      console.error(err);
      return { error: "Server error" };
    }
  }
}

const usersService = new UsersService();
export default usersService;
