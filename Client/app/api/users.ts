import { getUserInfo } from "../utils/userSession";
import { API_URL } from "./config";

const BASE_URL = `${API_URL}/api/users`;

export const getTourGuideInfo = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tourGuide/${id}`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to get tour guide info");
  }
};

export const followTourGuide = async (id: string, unfollow) => {
  const response = await fetch(
    `${BASE_URL}/tourGuide/${id}/${unfollow ? "unfollow" : "follow"}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${(await getUserInfo()).token}`,
      },
    }
  );
};
