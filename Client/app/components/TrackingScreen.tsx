import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import TrackingMap from "./ TrackingMap";
import { getAvatar } from "../api/media";

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

  return (
    <View style={{ flex: 1 }}>
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
      <View style={styles.bottomSheet}>
        {isGuide ? (
          <>
            <Text style={styles.sheetTitle}>Participants</Text>
            <View>
              <FlatList
                data={participantArray}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.participantItem}>
                    <Image
                      source={{ uri: getAvatar(item.id) }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: "#fff",
                      }}
                    />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.distance}>{item.distance}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => callPhone(item.phone)}
                    >
                      <Text style={styles.callButtonText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sheetTitle}>Tour Guide</Text>
            <View style={styles.participantItem}>
              <Image
                source={{ uri: getAvatar(guide.id) }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.name}>{guide.name}</Text>
                <Text style={styles.distance}>Nearby</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => callPhone(guide.phone)}
              >
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  bottomSheet: {
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
  sheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  callButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
