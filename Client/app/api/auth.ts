import { RegistrationData } from "../contexts/RegistrationContext";
import toFormData from "../utils/toFormData";
import { API_URL } from "./config";

const BASE_URL = `${API_URL}/api/auth`;

export const registerHandler = async (data: RegistrationData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    body: toFormData(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    if (
      response.status === 400 &&
      errorData?.message === "User already exists"
    ) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    throw new Error(errorData?.message || "Registration failed");
  }

  return response.json();
};

export const loginHandler = async (data: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to login");
  }
};
