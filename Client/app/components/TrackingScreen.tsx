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
import { calcDistanceInKm } from "../utils/geo";
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

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
  checkedIn: boolean;
}

interface Guide {
  id: string;
  name: string;
  phone: string;
}

interface TrackingScreenProps {
  isGuide: boolean;
  guide: Guide;
  participants: Participant[];
  locations: Record<string, Location>;
  traveler?: Participant; // traveler using this screen
}

const TrackingScreen: React.FC<TrackingScreenProps> = ({
  isGuide,
  guide,
  participants,
  traveler,
  locations,
}) => {
  // Bottom sheet reference and configurations
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%", "50%", "90%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const guideLocation = locations[guide.id];

  const participantArray = Object.values(participants || {})
    .filter((p) => p.checkedIn === true)
    .map((p, index) => ({
      id: p.id,
      _id: p._id,
      name: p.name,
      phone: p.phoneNumber,
      avatar: getAvatar(p.id),
      checkedIn: p.checkedIn,
      distance:
        locations[p.id] && guideLocation
          ? calcDistanceInKm(guideLocation, locations[p.id])
          : "Distance not available",
      location: locations[p.id],
    }));

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
          guideLocation={locations[guide.id]}
          participants={isGuide ? participantArray : undefined}
          travelerLocation={locations[traveler?.id]}
          tourGuideId={guide.id}
          travelerId={traveler?.id}
        />

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          handleIndicatorStyle={styles.indicator}
        >
          <View style={[styles.sheetContentContainer]}>
            {isGuide && (
              <>
                <Text style={styles.sheetTitle}>Participants</Text>

                <BottomSheetFlatList
                  data={participantArray}
                  keyExtractor={(item) => item._id}
                  renderItem={renderParticipantItem}
                  contentContainerStyle={styles.listContainer}
                  ListEmptyComponent={
                    <View>
                      <Text style={styles.emptyParticipants}>
                        No participants
                      </Text>
                    </View>
                  }
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
                <Text style={styles.distance}>
                  {guideLocation && locations[traveler.id]
                    ? calcDistanceInKm(guideLocation, locations[traveler.id])
                    : "Distance not available"}
                </Text>
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
  emptyParticipants: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginVertical: 20,
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
