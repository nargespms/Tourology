import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { getMediaSrc } from "../api/media";
import { Tour } from "../types/tour";

interface TourGuideTourListProps {
  tour: Tour;
  onPress?: (item: Tour) => void;
}

const TourGuideTourList: React.FC<TourGuideTourListProps> = ({
  tour,
  onPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => onPress && onPress(tour)}>
      <View style={styles.container}>
        <View>
          <Image
            source={{ uri: getMediaSrc(tour.photos[0]) }}
            style={styles.bookingImage}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{tour.name}</Text>
          <Text style={styles.location}>{tour.location}</Text>
          <Text>{tour.description}</Text>

          {!tour.paid && tour.rating && (
            <Text style={styles.ratingText}>★ {tour.rating.toFixed(1)}</Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TourGuideTourList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  bookingImage: {
    width: 98,
    height: 98,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    marginTop: 6,
    fontSize: 13,
    color: "#777",
    marginVertical: 2,
  },
  date: {
    fontSize: 14,
    color: "#444",
  },
  paidBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  paidText: {
    fontSize: 12,
    color: "#388E3C",
    fontWeight: "bold",
  },
  checkinButton: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  checkinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  feedbackButton: {
    backgroundColor: "#D9D9DB",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  feedbackButtonText: {
    color: "#000",
    fontSize: 14,
    paddingHorizontal: 16,
    fontWeight: "bold",
  },
  ratingText: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
    flexDirection: "row",
    position: "absolute",
    right: 0,
    top: 0,
  },
});
