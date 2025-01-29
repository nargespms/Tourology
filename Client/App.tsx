// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "./theme/theme";
import { ThemeProvider } from "./theme/ThemeContext";
import Navigator from "./navigation/Navigation";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <ThemeProvider value={theme}>
          <Navigator />
        </ThemeProvider>
      </NavigationContainer>
    </>
  );
}
