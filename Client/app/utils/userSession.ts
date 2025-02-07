import AsyncStorage from "@react-native-async-storage/async-storage";

// Save user info after login
const storeUserInfo = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user info:", error);
  }
};

// Retrieve user info
const getUserInfo = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to retrieve user info:", error);
    return null;
  }
};

// Remove user info on logout
const removeUserInfo = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Failed to remove user info:", error);
  }
};

export { storeUserInfo, getUserInfo, removeUserInfo };
