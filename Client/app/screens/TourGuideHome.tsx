import AntDesign from "@expo/vector-icons/AntDesign";
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

import { useQuery } from "@tanstack/react-query";
import { getOwnedTours } from "../api/tours";
import ActiveTourCard from "../components/ActiveTourCard";
import BottomNavBar from "../components/BottomNavBar";
import CustomModal from "../components/CustomeModal";
import QRCodeScanner from "../components/QRCodeScanner";
import SmallPicTourCard from "../components/SmallPicTourCard";
import { activeTour } from "../data/bookings";
import { tourGuideNavbar } from "../data/navbarOptions";

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

  const {
    isFetching,
    data: ownTours,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["tourGuideTours"],
    queryFn: getOwnedTours,
  });

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
        {isFetching && <Text>Loading...</Text>}
        {!isFetching && isFetched && ownTours?.length === 0 && (
          <View style={styles.noToursFound}>
            <Text style={{ color: "#696969", fontSize: 16 }}>
              No tours found
            </Text>
          </View>
        )}
        {!isFetching && isFetched && ownTours && (
          <FlatList
            data={Object.values(ownTours)}
            keyExtractor={(tour) => tour.id}
            renderItem={({ item }) => {
              return (
                <SmallPicTourCard
                  key={item.id}
                  tour={item}
                  enableButtons={false}
                />
              );
            }}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <View style={styles.createTourButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateTour" as never)}
          style={styles.createTourButton}
        >
          <AntDesign
            name="plus"
            size={18}
            color="white"
            style={{ paddingRight: 8 }}
          />
          <Text style={{ color: "#fff", fontSize: 14 }}>New tour</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 18,
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

  createTourButtonContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    marginBottom: 20,
  },

  createTourButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    width: 150,
  },
  noToursFound: {
    paddingVertical: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
