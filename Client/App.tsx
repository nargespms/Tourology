// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "./theme/theme";
import { ThemeProvider } from "./theme/ThemeContext";
import Navigator from "./navigation/Navigation";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toastConfig from "./app/components/ToasConfig";
import { LoggedUserProvider } from "./app/contexts/loggedUserData";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar />
      <LoggedUserProvider>
        <NavigationContainer>
          <ActionSheetProvider>
            <ThemeProvider value={theme}>
              <Navigator />
              <Toast config={toastConfig} />
            </ThemeProvider>
          </ActionSheetProvider>
        </NavigationContainer>
      </LoggedUserProvider>
    </QueryClientProvider>
  );
}
