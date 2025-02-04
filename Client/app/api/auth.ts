import { RegistrationData } from "../contexts/RegistrationContext";
import { API_URL } from "./config";

const BASE_URL = `${API_URL}/api/auth`;

export const registerHandler = async (data: RegistrationData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to register");
  }
};
