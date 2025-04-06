import React, { useEffect, useState } from "react";
import { useLoggedUser } from "../contexts/loggedUserData";
import useShareLiveLocation from "../hooks/useShareLiveLocation";
import { getActiveTour, userBookedTours } from "../api/tours";
import { useQuery } from "@tanstack/react-query";

const ShareLocation = () => {
  const { data } = useLoggedUser();
  const [enabled, setEnabled] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);

  console.log("data", data);
  console.log("activeTourId", activeTourId);
  console.log("enabled", enabled);

  useShareLiveLocation(enabled, activeTourId, data?.id);

  const { data: activeTour, refetch: refetchActiveTour } = useQuery({
    queryKey: ["activeTour"],
    queryFn: getActiveTour,
    enabled: !!data && data.role === "guide",
  });

  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: userBookedTours,
    enabled: !!data && data.role === "traveler",
  });

  useEffect(() => {
    if (activeTour) {
      setActiveTourId(activeTour._id);
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [activeTour]);

  useEffect(() => {
    if (bookings) {
      const ongoingBooking = bookings.find(
        (booking) => booking.state === "active"
      );

      console.log("ongoingBooking", ongoingBooking);
      if (ongoingBooking) {
        setActiveTourId(ongoingBooking._id);
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    }
  }, [bookings]);

  return null;
};

export default ShareLocation;
