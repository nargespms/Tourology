import fs from 'fs';
import { uploadDir } from '../middleware/multerConfig.js';
import User from '../models/User.model.js';

const getMedia = async (req, res) => {
  try {
    const filename = req.params.filename;

    // read the file from the uploads directory
    const path = uploadDir + "/" + filename;

    // check if the file exists
    if (!fs.existsSync(path)) {
      return res.status(404).json({ error: "File not found" });
    }

    // read the file
    const media = fs.readFileSync(path);

    // set the appropriate content type
    if (filename.endsWith(".png")) res.setHeader("Content-Type", "image/png");
    else if (filename.endsWith(".jpg")) res.setHeader("Content-Type", "image/jpeg");

    // send the file
    res.send(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getProfilePicture = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.params.filename = user.profilePicture;

    return await getMedia(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export default { getMedia, getProfilePicture };
