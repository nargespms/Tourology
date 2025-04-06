import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import CustomModal from "../components/CustomeModal";
import CustomTabs from "../components/CustomeTabs";
import FeedbackForm from "../components/FeedbackForm";
import SmallPicTourCard from "../components/SmallPicTourCard";
import { pastBookings, upcomingBookings } from "../data/bookings";
import { travelerNavbar } from "../data/navbarOptions";
import { userBookedTours } from "../api/tours";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Booking } from "../types/tour";
import QRCodeCheckin from "../components/QRCodeCheckin";
import { Ionicons } from "@expo/vector-icons";
import TrackingMap from "../components/ TrackingMap";
import { useLoggedUser } from "../contexts/loggedUserData";
import TrackingScreen from "../components/TrackingScreen";
import { getUserLocation } from "../utils/UserLocation";
import useTourLiveLocations from "../hooks/useTourLiveLocations";

// For testing, static coordinate data:
const guideLoc = {
  latitude: 37.78825,
  longitude: -122.4324,
};

const participantLocs = [
  { latitude: 37.78945, longitude: -122.4203 },
  { latitude: 37.78765, longitude: -122.4399 },
];

const travelerLoc = {
  latitude: 37.78875,
  longitude: -122.4344,
};

const Tabs = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Previous", value: "previous" },
  { label: "Ongoing", value: "ongoing" },
];

const TravelerBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState<"qr" | "feedback" | null>(null);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [trackingTour, setTrackingTour] = useState<Booking | null>(null);

  const { data: travelerData } = useLoggedUser();

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: userBookedTours,
  });

  // console.log("Bookings:", bookings);

  const bookingsList = (bookings?.filter((booking) => {
    if (activeTab === "upcoming") return booking?.upcoming;
    if (activeTab === "previous") return !booking?.upcoming;
    if (activeTab === "ongoing") return booking?.state === "active";
    return false;
  }) ?? []) as Booking[];

  const fetchLocation = async () => {
    const userLoc = await getUserLocation();

    if (userLoc) {
      console.log("User location:", userLoc);
    } else {
      console.log("Location unavailable", userLoc);
    }
  };
  fetchLocation();

  const handleCheckIn = async (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType("qr");
  };

  const handleLeaveFeedback = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType("feedback");
  };

  const handleFeedbackSubmit = (rating: number, feedback: string) => {
    setSelectedBooking(null);
    setModalType(null);
  };

  const handleTrackTour = (tour: Booking) => {
    setTrackingTour(tour);
    setIsTrackingEnabled(true);
  };
  const handleChangeBottomNav = (name: string) => {
    if (name === "Home") {
      navigation.navigate("TravelerHome" as never);
    } else if (name === "Bookings") {
      navigation.navigate("TravelerBookings" as never);
    } else if (name === "Favorites") {
      Alert.alert("Coming soon", "This feature is not available yet.");
    } else if (name === "Profile") {
      Alert.alert("Coming soon", "This feature is not available yet.");
    }
  };

  const onCheckinSuccess = async () => {
    queryClient.invalidateQueries(["userCheckedIn", selectedBooking?._id]);
    setSelectedBooking(null);
    setModalType(null);

    const location = fetchLocation();
    console.log("Location fetched", location);

    if (!location) {
      Alert.alert(
        "Access Location Recommended",
        "To ensure your tour guide can assist you in case you get lost, please enable location access.\n You can go to Settings > Privacy > Location Services > Expo > Location -> While Using the App"
      );

      // handle sending location to server
    } else {
      console.log("Location fetched", location);
    }
  };

  const locations = useTourLiveLocations(trackingTour?._id, isTrackingEnabled);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 18 }}>
        <Text style={styles.title}>Bookings</Text>

        <CustomTabs
          tabs={Tabs}
          activeTab={activeTab}
          onTabPress={(val) => setActiveTab(val)}
        />

        {isLoading && <Text>Loading...</Text>}
        {isError && <Text>Failed to load bookings</Text>}

        {!isLoading && bookingsList.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No {""}
            {activeTab === "upcoming"
              ? "upcoming"
              : "previous"
              ? "previous"
              : "ongoing"}
            {""} bookings
          </Text>
        )}

        {bookingsList.length > 0 && (
          <FlatList
            data={bookingsList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TravelerRouteDetails", {
                    tour: item,
                  });
                }}
                key={item._id}
              >
                <SmallPicTourCard
                  tour={item}
                  isUpcoming={activeTab === "upcoming"}
                  isOngoing={activeTab === "ongoing"}
                  onCheckIn={
                    activeTab === "upcoming"
                      ? () => handleCheckIn(item)
                      : undefined
                  }
                  onLeaveFeedback={
                    activeTab === "previous"
                      ? () => handleLeaveFeedback(item)
                      : undefined
                  }
                  onTrack={
                    activeTab === "ongoing"
                      ? () => handleTrackTour(item)
                      : undefined
                  }
                />
              </TouchableOpacity>
            )}
          />
        )}

        <CustomModal
          visible={!!selectedBooking}
          onClose={() => {
            setSelectedBooking(null);
            setModalType(null);
          }}
        >
          {modalType === "qr" && selectedBooking && (
            <QRCodeCheckin
              tourId={selectedBooking._id}
              onCheckinSuccess={onCheckinSuccess}
              onClose={() => {
                setSelectedBooking(null);
                setModalType(null);
              }}
            />
          )}

          {modalType === "feedback" && (
            <View style={styles.feedbackContainer}>
              <FeedbackForm
                tourId={selectedBooking?._id}
                onSubmit={handleFeedbackSubmit}
                onClose={() => {
                  setSelectedBooking(null);
                  setModalType(null);
                }}
              />
            </View>
          )}
        </CustomModal>

        <CustomModal
          visible={isTrackingEnabled}
          onClose={() => setIsTrackingEnabled(false)}
          customStyle={{ padding: 1 }}
        >
          <View style={styles.headerTitle}>
            <Text style={styles.trackingTitle}>Tracking My Tour</Text>
            <TouchableOpacity
              onPress={() => setIsTrackingEnabled(false)}
              style={styles.trackingCloseButton}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ height: 700, flex: 1 }}>
            <TrackingScreen
              isGuide={false}
              guide={{
                id: trackingTour?.host.id,
                name: trackingTour?.host.name,
                phone: trackingTour?.host.phone,
                location: guideLoc,
              }}
              traveler={{
                id: travelerData.id,
                name: travelerData.name,
                phone: travelerData.phone,
              }}
              locations={locations}
              participants={[]}
            />
          </View>
        </CustomModal>
      </View>

      <BottomNavBar
        items={travelerNavbar}
        currentTab="Bookings"
        onTabPress={(name) => handleChangeBottomNav(name)}
      />
    </SafeAreaView>
  );
};

export default TravelerBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#777",
    marginBottom: 20,
  },
  checkinContainer: {
    padding: 8,
    paddingBottom: 50,
    minHeight: "60%",
  },
  qrCodeContainer: {
    margin: "auto",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  feedbackContainer: {
    minHeight: "60%",
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  trackingCloseButton: {
    position: "absolute",
    right: 10,
  },
});
