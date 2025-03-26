import { getCurrentPositionAsync } from "expo-location";
import toFormData from "../utils/toFormData";
import uriToFile from "../utils/uriToFile";
import { getUserInfo } from "../utils/userSession";
import { API_URL } from "./config";

const BASE_URL = `${API_URL}/api/tours`;

export const getTours = async (filter: "" | "followed" | "free" = "") => {
  const response = await fetch(`${BASE_URL}/${filter}`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to get tours");
  }
};

export const getTour = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to get tour");
  }
};

export const searchTours = async (query: string) => {
  const response = await fetch(`${BASE_URL}/search?q=${query}`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to search tours");
  }

  return response.json();
};

export const nearbyTours = async () => {
  // get user location
  const location = await getCurrentPositionAsync();

  const {
    coords: { latitude: lat, longitude: lng },
  } = location;

  const response = await fetch(
    `${BASE_URL}/nearby?lat=${lat}&lng=${lng}&length=20000`,
    {
      headers: {
        authorization: `Bearer ${(await getUserInfo()).token}`,
      },
    }
  );

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to get nearby tours");
  }
};

export const createTour = async (data: Record<string, any>) => {
  const formData = new FormData();

  // clone deep object
  const cloneData = JSON.parse(JSON.stringify(data));

  // collect all files in the data object
  if (cloneData.photos) {
    cloneData.photos.forEach((photo) => {
      formData.append("files[photos][]", uriToFile(photo));
    });
    delete cloneData.photos;
  }

  if (cloneData.stops) {
    Object.entries(cloneData.stops).forEach(([key, value]) => {
      if (value.photo) {
        formData.append(`files[${key}][]`, uriToFile(value.photo));
        delete cloneData.stops[key].photo;
      }
    });
  }

  formData.append("data", JSON.stringify(cloneData));

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    body: formData,
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to create tour");
  }
};

export const getOwnedTours = async () => {
  const response = await fetch(`${BASE_URL}/owned`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to get owned tours");
  }
};
export const getHostTours = async (id: string) => {
  const response = await fetch(`${BASE_URL}/host/${id}`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    // console.log(await response.json());
    return response.json();
  } else {
    throw new Error("Failed to get host tours");
  }
};

export const getIsFavorite = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}/favorite`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to get favorite status");
  }
};

export const toggleFavorite = async (id: string, unfavorite: boolean) => {
  const response = await fetch(
    `${BASE_URL}/${id}/favorite?unfavorite=${unfavorite ? "1" : "0"}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${(await getUserInfo()).token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to toggle favorite");
  }
};

export const bookATour = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}/book`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to book a tour");
  }

  return response.json();
};

export const isTourBooked = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}/booked`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to check if booked");
  }

  return response.json();
};

export const userBookedTours = async () => {
  const response = await fetch(`${BASE_URL}/user/booked`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user booked tours");
  }

  return response.json();
};

export const upsertFeedback = async (
  tourId: string,
  feedback: string,
  rating: number
) => {
  const response = await fetch(`${BASE_URL}/${tourId}/feedback`, {
    method: "POST",
    body: toFormData({ feedback, rating }),
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upsert feedback");
  }

  return response.json();
};

export const getFeedback = async (tourId: string) => {
  const response = await fetch(`${BASE_URL}/${tourId}/feedback`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get feedback");
  }

  return response.json();
};

export const getUserHasCheckedIn = async (tourId: string) => {
  const response = await fetch(`${BASE_URL}/user/checked-in/${tourId}`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user check-in status");
  }

  return response.json();
};

export const deleteTour = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to delete tour");
  }
};

export const checkIn = async (tourId: string, userId: string) => {
  const response = await fetch(`${BASE_URL}/${tourId}/check-in`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
    body: toFormData({ userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to check in");
  }

  return response.json();
};

export const changeTourState = async (tourId: string, state: string) => {
  const response = await fetch(`${BASE_URL}/${tourId}/change-state`, {
    method: "POST",
    body: toFormData({ state }),
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to change tour state");
  }

  return response.json();
};

export const getActiveTour = async (tourId) => {
  const response = await fetch(`${BASE_URL}/active`, {
    headers: {
      authorization: `Bearer ${(await getUserInfo()).token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get active tour");
  }

  return response.json();
};
