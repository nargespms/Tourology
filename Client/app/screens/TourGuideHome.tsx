import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  changeTourState,
  deleteTour,
  getActiveTour,
  getOwnedTours,
} from "../api/tours";
import ActiveTourCard from "../components/ActiveTourCard";
import BottomNavBar from "../components/BottomNavBar";
import CustomModal from "../components/CustomeModal";
import QRCodeScanner from "../components/QRCodeScanner";
import TourGuideTourList from "../components/TourGuideTourList";
import { tourGuideNavbar } from "../data/navbarOptions";
import CustomTabs from "../components/CustomeTabs";
import { useLoggedUser } from "../contexts/loggedUserData";
import { LiveLocationManager } from "../utils/LiveLocationManagers";

const Tabs = [
  { label: "Planned", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Ended", value: "ended" },
];

const TourGuideHome: React.FC = () => {
  const navigation = useNavigation();
  const [isQRModalVisible, setQRModalVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const { data: complementaryTourGuide } = useLoggedUser();

  const handleBottomNavChange = (name: string) => {
    if (name === "Profile") {
      navigation.navigate("TourGuideProfile" as never, {
        complementaryTourGuide,
      });
    } else if (name === "check-ins") {
      setQRModalVisible(true);
    } else if (name === "Explore") {
      Alert.alert("Coming soon", "This feature is not available yet.");
    }
  };

  const handleDeleteTourAlert = (tourId: string) => {
    Alert.alert("Delete Tour", "Are you sure you want to delete this tour?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          mutate(tourId);
          return undefined;
        },
      },
    ]);
  };

  const handlePressOwnTours = (tour) => {
    const options = ["Activate", "Preview", "Delete", "Cancel"];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;
    const title = tour.name;

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            // activate
            activateTour(tour._id);
            break;

          case 1:
            // Preview
            navigation.navigate("TravelerRouteDetails", { tour });
            break;
          case 2:
            handleDeleteTourAlert(tour._id);
            break;
        }
      }
    );
  };

  const {
    isFetching,
    data: ownToursList,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["tourGuideTours"],
    queryFn: getOwnedTours,
  });

  const [activeTab, setActiveTab] = useState("published");

  const ownTours = ownToursList?.filter((tour) => tour.state === activeTab);

  const { data: activeTour, refetch: refetchActiveTour } = useQuery({
    queryKey: ["activeTour"],
    queryFn: getActiveTour,
  });

  const { mutate: activateTour } = useMutation({
    mutationFn: (tourId) => changeTourState(tourId, "active"),
    onSuccess: async (res) => {
      if (!res.success) {
        Toast.show({
          type: "error",
          text1: res.message,
          text2: "End the current active tour and try again.",
          visibilityTime: 7000,
          topOffset: 50,
        });
        return;
      }
      Toast.show({
        type: "success",
        text1: "Tour successfully activated",
        visibilityTime: 5000,
        topOffset: 50,
      });
      await refetchActiveTour();
      await refetch();
    },
  });

  const { mutate } = useMutation<string, unknown, string>({
    mutationFn: deleteTour,
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Tour successfully deleted",
        visibilityTime: 5000,
        topOffset: 50,
      });
      await refetch();
      // If successful, reset or navigate
      refetch();
    },
    onError: () => {
      // Could handle error toast or something else here
    },
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
        <CustomTabs
          tabs={Tabs}
          activeTab={activeTab}
          onTabPress={(val) => setActiveTab(val)}
        />
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
            keyExtractor={(tour) => tour._id}
            renderItem={({ item }) => {
              return (
                <TourGuideTourList
                  key={item._id}
                  tour={item}
                  onPress={handlePressOwnTours}
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
          <Text style={{ color: "#fff", fontSize: 14 }}>New tour </Text>
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
    paddingBottom: 100,
  },
  listContent: {
    paddingBottom: 50,
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
    bottom: 80,
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
