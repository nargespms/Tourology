import { API_URL } from "./config";

const BASE_URL = `${API_URL}/api/media`;

export const getMediaSrc = (media: string) => {
  if (!media) {
    // empty gif base64
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }

  if (
    media.startsWith("http") ||
    media.startsWith("data:image") ||
    media.startsWith("file://")
  ) {
    return media;
  }

  return `${BASE_URL}/${media}`;
};

export const getAvatar = (userId: string) => {
  return `${BASE_URL}/avatar/${userId}`;
};

