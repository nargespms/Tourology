// Creating an in-memory storage instead of using AsyncStorage
let userSessionData = null;

// Save user info after login
const storeUserInfo = async (user) => {
  try {
    userSessionData = user;
  } catch (error) {
    console.error("Failed to save user info:", error);
  }
};

// Retrieve user info
const getUserInfo = async () => {
  try {
    return userSessionData;
  } catch (error) {
    console.error("Failed to retrieve user info:", error);
    return null;
  }
};

// Remove user info on logout
const removeUserInfo = async () => {
  try {
    userSessionData = null;
  } catch (error) {
    console.error("Failed to remove user info:", error);
  }
};

export { storeUserInfo, getUserInfo, removeUserInfo };
