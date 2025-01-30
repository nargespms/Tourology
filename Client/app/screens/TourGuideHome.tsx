import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomNavBar from "../components/BottomNavBar";
import SmallPicTourCard from "../components/SmallPicTourCard";
import ActiveTourCard from "../components/ActiveTourCard";
import { pastBookings, activeTour } from "../data/bookings";
import { tourGuideNavbar } from "../data/navbarOptions";
import CustomModal from "../components/CustomeModal";
import QRCodeScanner from "../components/QRCodeScanner";

const TourGuideHome: React.FC = () => {
  const navigation = useNavigation();
  const [isQRModalVisible, setQRModalVisible] = useState(false);

  const handleBottomNavChange = (name: string) => {
    if (name === "Explore") {
      // navigation.navigate("TravelerBookings" as never);
    } else if (name === "check-ins") {
      setQRModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {activeTour && (
        <View style={styles.activeTourSection}>
          <Text style={styles.sectionTitle}>Active Tour</Text>
          <ActiveTourCard tour={activeTour} />
        </View>
      )}
      <View style={styles.contentWrapper}>
        <Text style={styles.sectionTitle}>My Tours</Text>
        <FlatList
          data={pastBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SmallPicTourCard data={item} enableButtons={false} />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.navbarWrapper}>
        <BottomNavBar
          items={tourGuideNavbar}
          currentTab={"Home"}
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

export default TourGuideHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  activeTourSection: {
    backgroundColor: "#FFF4EC",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
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
