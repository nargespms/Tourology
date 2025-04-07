import { useEffect, useState } from "react";
import { LiveLocationManager } from "../utils/LiveLocationManagers";

interface Location {
  latitude: number;
  longitude: number;
}

export default function useTourLiveLocations(
  tourId: string,
  isActive: boolean
) {
  const [locations, setLocations] = useState<Record<String, Location>>({});

  useEffect(() => {
    const updateLocations = (data: any) => {
      const { userId, location } = data;
      setLocations((prevLocations) => ({
        ...prevLocations,
        [userId]: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }));
    };

    if (isActive) {
      LiveLocationManager.getSocket()?.on("locationUpdate", updateLocations);
    }

    return () => {
      if (isActive) {
        LiveLocationManager.getSocket()?.off("locationUpdate", updateLocations);
      }
    };
  }, [isActive]);

  return locations;
}
