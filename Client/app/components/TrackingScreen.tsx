import React, { useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import TrackingMap from "./ TrackingMap";
import { getAvatar } from "../api/media";
import { Ionicons } from "@expo/vector-icons";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
// test data
const participantLocs = [
  { latitude: 37.78945, longitude: -122.4203 },
  { latitude: 37.78765, longitude: -122.4399 },
];

interface Location {
  latitude: number;
  longitude: number;
}

interface Participant {
  id: string;
  _id: string;
  name: string;
  phoneNumber: string;
  distance: string;
  location: Location;
}

interface Guide {
  id: string;
  name: string;
  phone: string;
  location: Location;
}

interface TrackingScreenProps {
  isGuide: boolean;
  guide: Guide;
  participants: Participant[];
  traveler?: Participant; // traveler using this screen
}

const TrackingScreen: React.FC<TrackingScreenProps> = ({
  isGuide,
  guide,
  participants,
  traveler,
}) => {
  // Bottom sheet reference and configurations
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const participantArray = Object.values(participants || {}).map(
    (p, index) => ({
      id: p.id,
      _id: p._id,
      name: p.name,
      phone: p.phoneNumber,
      avatar: getAvatar(p.id),
      distance: "200m", // placeholder
      location: participantLocs[index], // match location by index temporarily
    })
  );

  // Render item for participants list
  const renderParticipantItem = useCallback(
    ({ item }) => (
      <View style={styles.participantItem}>
        <Image source={{ uri: getAvatar(item.id) }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => callPhone(item.phone)}
        >
          <Ionicons name="call-outline" size={16} color="#333" />
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>
      </View>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Tracking Map */}
        <TrackingMap
          guideLocation={guide.location}
          participantLocations={isGuide ? participantLocs : undefined}
          travelerLocation={traveler?.location}
          tourGuideId={guide.id}
          travelerId={traveler?.id}
          attendees={isGuide ? participants : undefined}
        />

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          handleIndicatorStyle={styles.indicator}
        >
          <View style={styles.sheetContentContainer}>
            {isGuide && (
              <>
                <Text style={styles.sheetTitle}>Participants</Text>
                <BottomSheetFlatList
                  data={participantArray}
                  keyExtractor={(item) => item._id}
                  renderItem={renderParticipantItem}
                  contentContainerStyle={styles.listContainer}
                />
              </>
            )}
          </View>
        </BottomSheet>
        {!isGuide && (
          <View style={styles.travelerSheet}>
            <Text style={styles.sheetTitle}>Tour Guide</Text>
            <View style={styles.participantItem}>
              <Image
                source={{ uri: getAvatar(guide.id) }}
                style={styles.avatar}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.name}>{guide.name}</Text>
                <Text style={styles.distance}>Nearby</Text>
              </View>

              <TouchableOpacity
                style={styles.callButton}
                onPress={() => callPhone(guide.phone)}
              >
                <Ionicons name="call-outline" size={16} color="#333" />
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicator: {
    backgroundColor: "#CCCCCC",
    width: 40,
    height: 5,
  },
  travelerSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  sheetContentContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  distance: {
    fontSize: 12,
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
});
