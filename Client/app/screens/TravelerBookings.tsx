import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingCard from "../components/BookingCard";
import { Booking, pastBookings, upcomingBookings } from "../data/bookings";
import FeedbackForm from "../components/FeedbackForm";
import CustomTabs from "../components/CustomeTabs";
import CustomModal from "../components/CustomeModal";
import BottomNavBar from "../components/BottomNavBar";
import { travelerNavbar } from "../data/navbarOptions";
import { useNavigation } from "@react-navigation/native";

const Tabs = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Previous", value: "previous" },
];

const TravelerBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState<"qr" | "feedback" | null>(null);

  const navigation = useNavigation();

  const handleCheckIn = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType("qr");
  };

  const handleLeaveFeedback = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType("feedback");
  };

  const handleFeedbackSubmit = (rating: number, feedback: string) => {
    console.log(`Submitted feedback: ${rating} stars - "${feedback}"`);
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bookings</Text>

      <CustomTabs
        tabs={Tabs}
        activeTab={activeTab}
        onTabPress={(val) => setActiveTab(val)}
      />

      <FlatList
        data={activeTab === "upcoming" ? upcomingBookings : pastBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            isUpcoming={activeTab === "upcoming"}
            onCheckIn={
              activeTab === "upcoming" ? () => handleCheckIn(item) : undefined
            }
            onLeaveFeedback={
              activeTab === "previous"
                ? () => handleLeaveFeedback(item)
                : undefined
            }
          />
        )}
      />

      <CustomModal
        visible={!!selectedBooking}
        onClose={() => {
          setSelectedBooking(null);
          setModalType(null);
        }}
      >
        {modalType === "qr" && selectedBooking && (
          <View style={styles.checkinContainer}>
            <Text style={styles.modalTitle}>Check-in</Text>
            <Text style={styles.modalSubtitle}>
              Ask your tour guide to scan the QR code to check you in.
            </Text>
            <View style={styles.qrCodeContainer}>
              <QRCode value={selectedBooking.qrCodeValue} size={270} />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedBooking(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {modalType === "feedback" && (
          <View style={styles.feedbackContainer}>
            <FeedbackForm
              onSubmit={handleFeedbackSubmit}
              onClose={() => {
                setSelectedBooking(null);
                setModalType(null);
              }}
            />
          </View>
        )}
      </CustomModal>
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
    paddingHorizontal: 16,
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
