import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
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

const Tabs = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Previous", value: "previous" },
];

const TravelerBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState<"qr" | "feedback" | null>(null);

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

  const bookingsList = (bookings?.filter(
    (booking) => booking?.upcoming === (activeTab === "upcoming")
  ) ?? []) as Booking[];

  const handleCheckIn = (booking: Booking) => {
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
  const handleChangeBottomNav = (name: string) => {
    if (name === "Home") {
      navigation.navigate("TravelerHome" as never);
    } else if (name === "Bookings") {
      navigation.navigate("TravelerBookings" as never);
    }
  };

  const onCheckinSuccess = () => {
    queryClient.invalidateQueries(["userCheckedIn", selectedBooking?._id]);
    setSelectedBooking(null);
    setModalType(null);
  };

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
            No {activeTab === "upcoming" ? "upcoming" : "previous"} bookings
          </Text>
        )}

        {bookingsList.length > 0 && (
          <FlatList
            data={bookingsList}
            keyExtractor={(item) => item.id}
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
});
