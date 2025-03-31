import * as Location from "expo-location";

export const getUserLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log("Location status:", status);

    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (err) {
    console.error("Error getting user location:", err);
    return null;
  }
};
