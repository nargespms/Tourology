// this module stores the logged in user data on a context and exposes a hook to access and update it plus the context provider

import React, { createContext, useContext, useState } from "react";

export interface LoggedUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "guide" | "traveler";
}

export interface LoggedUserContextType {
  data: LoggedUserData;
  updateData: (data: Partial<LoggedUserData>) => void;
}

const LoggedUserContext = createContext<LoggedUserContextType>({
  data: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "traveler",
  },
  updateData: () => {},
});

export const LoggedUserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, setData] = useState<LoggedUserData>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "traveler",
  });

  const updateData = (newData: Partial<LoggedUserData>) => {
    setData({ ...data, ...newData });
  };

  return (
    <LoggedUserContext.Provider value={{ data, updateData }}>
      {children}
    </LoggedUserContext.Provider>
  );
};

export const useLoggedUser = () => useContext(LoggedUserContext);
