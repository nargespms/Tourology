import React, { createContext, useContext } from "react";
import { theme } from "./theme";

const ThemeContext = createContext(theme);
export const ThemeProvider = ThemeContext.Provider;
export const useTheme = () => useContext(ThemeContext);
