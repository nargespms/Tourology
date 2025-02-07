import toFormData from "../utils/toFormData";
import uriToFile from "../utils/uriToFile";
import { getUserInfo } from "../utils/userSession";
import { API_URL } from "./config";

const BASE_URL = `${API_URL}/api/tours`;

export const getTours = async () => {
  const response = await fetch(`${BASE_URL}`);

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
      console.log("value", value, key);
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

  console.log("response", await getUserInfo());

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to get owned tours");
  }
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
