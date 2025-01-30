import React from "react";

import WelcomeScreen from "@/app/screens/WelcomeScreen";
import Register from "@/app/screens/Register";
import Login from "@/app/screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TravelerHome from "@/app/screens/TravelerHome";
import TourGuideHome from "@/app/screens/TourGuideHome";
import TravelerBookings from "@/app/screens/TravelerBookings";
import TravelerSearchResults from "@/app/components/TravelerSearchResult";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="TravelerHome"
        component={TravelerHome}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="TourGuideHome"
        component={TourGuideHome}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="TravelerBookings"
        component={TravelerBookings}
        options={{ headerShown: false, gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
