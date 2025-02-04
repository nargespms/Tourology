import React, { createContext, useContext, useState } from "react";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;

  bio?: string;
  skills?: string[];
  languages?: string[];
  profilePicture?: string;

  profileName?: string;
  yearsOfExperience?: number;

  role?: "guide" | "traveler";
}

export interface RegistrationContextType {
  data: RegistrationData;
  updateData: (data: Partial<RegistrationData>) => void;
}

const RegistrationContext = createContext<RegistrationContextType>({
  data: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  },
  updateData: () => {},
});

export const RegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, setData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const updateData = (newData: Partial<RegistrationData>) => {
    setData({ ...data, ...newData });
  };

  return (
    <RegistrationContext.Provider value={{ data, updateData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
