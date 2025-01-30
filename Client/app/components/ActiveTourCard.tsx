import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ActiveTour } from "../data/bookings";
import { useNavigation } from "@react-navigation/native";

interface ActiveTourProps {
  tour: ActiveTour;
  detailsButton?: boolean;
}

const ActiveTourCard: React.FC<ActiveTourProps> = ({
  tour,
  detailsButton = true,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={tour.image} style={styles.tourImage} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{tour.title}</Text>
        <Text style={styles.location}>{tour.location}</Text>
        <Text style={styles.startTime}>{tour.startTime}</Text>
        {detailsButton && (
          <TouchableOpacity style={styles.detailsButton}>
            <Text
              style={styles.detailsButtonText}
              onPress={() => navigation.navigate("ActiveTour" as never)}
            >
              Details
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.participantContainer}>
        <Ionicons name="people-outline" size={18} color="#333" />
        <Text style={styles.participantText}>{tour.participantCount}</Text>
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
