import usersService from "../services/users.service.js";

const getTourGuideInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourGuideId = req.params.tourGuideId;

    const info = await usersService.getTourGuideInfo(userId, tourGuideId);

    return res.json(info);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

const followTourGuide = async (req, res) => {
  try {
    const userId = req.user.id;
    const tourGuideId = req.params.tourGuideId;
    const unfollow = req.params.follow === "unfollow";

    const result = await usersService.followTourGuide(userId, tourGuideId, unfollow);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}


export default { getTourGuideInfo, followTourGuide };

