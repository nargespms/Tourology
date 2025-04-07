import Toast from "react-native-toast-message";
import { LiveLocationManager } from "../utils/LiveLocationManagers";
import { useEffect } from "react";
import { SOCKET_URL } from "../api/config";

export default function useShareLiveLocation(
  enabled: boolean,
  tourId: string,
  userId: string
) {
  console.log("enabled", enabled, tourId, userId);
  useEffect(() => {
    if (!enabled) {
      return;
    }

    LiveLocationManager.start(tourId, userId, SOCKET_URL).catch((error) => {
      // console.error("Error starting live location sharing:", error);
      Toast.show({
        type: "error",
        text1: "Error starting live location sharing",
        text2: error.message,
        visibilityTime: 7000,
        topOffset: 50,
      });
    });

    return () => {
      LiveLocationManager.stop();
    };
  }, [enabled, tourId, userId]);
}
