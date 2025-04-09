import React from "react";

import CreateTour from "@/app/screens/CreateTour";
import Login from "@/app/screens/Login";
import Register from "@/app/screens/Register";
import TourGuideActiveTour from "@/app/screens/TourGuideActiveTour";
import TourGuideHome from "@/app/screens/TourGuideHome";
import TourGuideProfile from "@/app/screens/TourGuideProfile";
import TravelerBookings from "@/app/screens/TravelerBookings";
import TravelerHome from "@/app/screens/TravelerHome";
import TravelerRouteDetails from "@/app/screens/TravelerRouteDetails";
import WelcomeScreen from "@/app/screens/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
      <Stack.Screen
        name="ActiveTour"
        component={TourGuideActiveTour}
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="TravelerRouteDetails"
        component={TravelerRouteDetails}
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="CreateTour"
        component={CreateTour}
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="TourGuideProfile"
        component={TourGuideProfile}
        options={{ headerShown: false, gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
