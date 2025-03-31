import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Tour } from "../types/tour";
import { getMediaSrc } from "../api/media";
import { formatDate, formatPrice } from "../utils/formats";
import { useQuery } from "@tanstack/react-query";
import { getUserHasCheckedIn } from "../api/tours";

interface BookingCardProps {
  tour: Tour;
  onCheckIn?: (item: Tour) => void;
  onLeaveFeedback?: (item: Tour) => void;
  onTrack?: (item: Tour) => void;
  isUpcoming?: boolean;
  isOngoing?: boolean;
  enableButtons?: boolean;
}

const SmallPicTourCard: React.FC<BookingCardProps> = ({
  tour,
  onCheckIn,
  onLeaveFeedback,
  onTrack,
  isUpcoming,
  isOngoing,
  enableButtons = true,
}) => {
  const { data: isCheckedIn } = useQuery({
    queryKey: ["userCheckedIn", tour._id],
    queryFn: () => getUserHasCheckedIn(tour._id),
    enabled: isUpcoming,
  });

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getMediaSrc(tour.photos[0]) }}
        style={styles.bookingImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{tour.name}</Text>
        <Text style={styles.location}>{tour.location}</Text>
        {tour?.startDate && (
          <Text style={styles.date}>{formatDate(tour?.startDate)}</Text>
        )}

        {!enableButtons && tour.paid && (
          <Text style={styles.price}>{formatPrice(tour.price)}</Text>
        )}

        {!enableButtons && tour.rating && (
          <Text style={styles.ratingText}>★ {tour.rating.toFixed(1)}</Text>
        )}

        {enableButtons && isUpcoming && tour.paid && (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>
              <Entypo name="check" size={12} color="green" /> Paid
            </Text>
          </View>
        )}

        {enableButtons && isUpcoming && !isCheckedIn && (
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => onCheckIn && onCheckIn(tour)}
          >
            <Text style={styles.checkinButtonText}>Check-in</Text>
          </TouchableOpacity>
        )}

        {isCheckedIn && enableButtons && isUpcoming && (
          <Text style={styles.checkedInButton}>Checked in!</Text>
        )}

        {enableButtons && !isUpcoming && !isOngoing && (
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => onLeaveFeedback && onLeaveFeedback(tour)}
          >
            <Text style={styles.feedbackButtonText}>Leave Feedback</Text>
          </TouchableOpacity>
        )}

        {enableButtons && isOngoing && (
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => onTrack && onTrack(tour)}
          >
            <Text style={styles.trackButtonText}>Tracking My Tour</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SmallPicTourCard;

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
    alignItems: "flex-start",
    alignContent: "center",
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    fontSize: 13,
    color: "#777",
    marginVertical: 2,
    paddingRight: 40,
  },
  date: {
    fontSize: 14,
    color: "#444",
  },
  price: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginTop: 7,
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

  checkedInButton: {
    backgroundColor: "#D9D9DB",
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
  trackButton: {
    borderWidth: 1,
    borderColor: "#046304",
    backgroundColor: "#04630421",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
  },
  trackButtonText: {
    color: "#2E8B57",
    fontSize: 14,
    fontWeight: "bold",
  },
});
