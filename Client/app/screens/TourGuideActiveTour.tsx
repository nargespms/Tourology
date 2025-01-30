import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import ActiveTourCard from "../components/ActiveTourCard";
import { checkedInUsers, awaitingUsers } from "../data/tours";
import CustomTabs from "../components/CustomeTabs";
import { activeTour } from "../data/bookings";
import BottomNavBar from "../components/BottomNavBar";
import { tourGuideNavbar } from "../data/navbarOptions";
import CustomModal from "../components/CustomeModal";
import QRCodeScanner from "../components/QRCodeScanner";

const TABS = [
  { label: "All", value: "all" },
  { label: "Awaiting", value: "awaiting" },
];

const TourGuideActiveTour: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isQRModalVisible, setQRModalVisible] = useState(false);

  const navigation = useNavigation();

  const handleCheckIn = (id: string) => {
    console.log("Check-in user:", id);
    setQRModalVisible(true);
  };
  const handleBottomNavChange = (name: string) => {
    if (name === "Explore") {
      // navigation.navigate("TourGuideExplore" as never);
    } else if (name === "Home") {
      navigation.navigate("TourGuideHome" as never);
    } else if (name === "check-ins") {
      setQRModalVisible(true);
    }
  };

  const handleCall = (phoneNumber: string) => {
    console.log("Calling:", phoneNumber);
  };

  const getFilteredData = () => {
    if (activeTab === "all") {
      return [...checkedInUsers, ...awaitingUsers];
    }
    return awaitingUsers;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Active Tour</Text>
        <View style={styles.activeTourInfoContainer}>
          <ActiveTourCard tour={activeTour} detailsButton={false} />
        </View>

        <Text style={styles.peopleTitle}>People</Text>
        <CustomTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        <FlatList
          data={getFilteredData()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.personRow}>
              <Image source={item.avatar} style={styles.avatar} />
              <View style={styles.personDetails}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={styles.statusText}>
                  {item.checkedIn
                    ? `Checked-in ${item.timeAgo}`
                    : "Hasn't checked in"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(item.phone)}
              >
                <Ionicons name="call-outline" size={16} color="#333" />
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>
              {!item.checkedIn && (
                <TouchableOpacity
                  style={styles.checkInButton}
                  onPress={() => handleCheckIn(item.id)}
                >
                  <Ionicons name="download-outline" size={16} color="#fff" />
                  <Text style={styles.checkInText}>Check-in</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <View style={styles.navbarWrapper}>
        <BottomNavBar
          items={tourGuideNavbar}
          currentTab={""}
          onTabPress={handleBottomNavChange}
        />
      </View>

      <CustomModal
        visible={isQRModalVisible}
        onClose={() => setQRModalVisible(false)}
      >
        <View style={styles.qrCodeScannerModal}>
          <Text style={styles.modalTitle}>Check-in</Text>
          <Text style={styles.modalSubtitle}>
            Scan the traveler’s QR code to check them in.
          </Text>
          <QRCodeScanner onScanSuccess={() => setQRModalVisible(false)} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setQRModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

export default TourGuideActiveTour;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 10,
  },
  activeTourInfoContainer: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 24,
  },
  peopleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 13,
    color: "#777",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  callText: {
    fontSize: 14,
    marginLeft: 6,
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  checkInText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 6,
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  qrCodeScannerModal: {
    minHeight: 500,
    padding: 8,
    paddingBottom: 50,
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
});
