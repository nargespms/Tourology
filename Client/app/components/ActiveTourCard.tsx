import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ActiveTour } from "../data/bookings";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../utils/formats";
import { getMediaSrc } from "../api/media";
import { useMutation } from "@tanstack/react-query";
import { changeTourState } from "../api/tours";

interface ActiveTourProps {
  tour: Tour;
  detailsButton?: boolean;
  completeButton?: boolean;
}

const ActiveTourCard: React.FC<ActiveTourProps> = ({
  tour,
  detailsButton = true,
  completeButton = false,
}) => {
  const navigation = useNavigation();

  const { mutate: endTourMutation } = useMutation({
    mutationFn: () => changeTourState(tour._id, "ended"),
    onSuccess: () => {
      Alert.alert("Tour ended successfully");
      navigation.navigate("TourGuideHome");
    },
  });

  const endTour = () => {
    Alert.alert("End tour", "Are you sure you want to end this tour?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "End",
        style: "destructive",
        onPress: () => endTourMutation(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getMediaSrc(tour.photos[0]) }}
        style={styles.tourImage}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{tour.name}</Text>
        <Text style={styles.location}>{tour.location}</Text>
        <Text style={styles.startTime}>{formatDate(tour.startDate)}</Text>
        {detailsButton && (
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate("ActiveTour", { tour })}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        )}
        {completeButton && (
          <TouchableOpacity style={styles.completeButton} onPress={endTour}>
            <Text style={styles.completeButtonText}>End</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.participantContainer}>
        {tour.attendees && (
          <>
            <Ionicons name="people-outline" size={18} color="#333" />
            <Text style={styles.participantText}>
              {Object.values(tour.attendees).length}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default ActiveTourCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    elevation: 2,
  },
  tourImage: {
    width: 98,
    height: 98,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  startTime: {
    fontSize: 14,
    color: "#2E8B57",
    fontWeight: "bold",
  },
  detailsButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  completeButton: {
    borderColor: "#3d3d3d",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  completeButtonText: {
    color: "#3d3d3d",
    fontSize: 14,
    fontWeight: "bold",
  },

  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 10,
    position: "absolute",
    right: 0,
    top: 0,
  },
  participantText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#333",
  },
});
