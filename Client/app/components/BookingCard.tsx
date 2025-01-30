import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Booking } from "../data/bookings";
import Entypo from "@expo/vector-icons/Entypo";

interface BookingCardProps {
  booking: Booking;
  onCheckIn?: (item: Booking) => void;
  onLeaveFeedback?: (item: Booking) => void;
  isUpcoming?: boolean;
  enableButtons?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCheckIn,
  onLeaveFeedback,
  isUpcoming,
  enableButtons = true,
}) => {
  return (
    <View style={styles.container}>
      <Image source={booking.image} style={styles.bookingImage} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{booking.title}</Text>
        <Text style={styles.location}>{booking.location}</Text>
        <Text style={styles.date}>{booking.date}</Text>

        {enableButtons && isUpcoming && booking.status === "paid" && (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>
              <Entypo name="check" size={12} color="green" /> Paid
            </Text>
          </View>
        )}

        {enableButtons && isUpcoming && (
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => onCheckIn && onCheckIn(booking)}
          >
            <Text style={styles.checkinButtonText}>Check-in</Text>
          </TouchableOpacity>
        )}

        {enableButtons && !isUpcoming && (
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => onLeaveFeedback && onLeaveFeedback(booking)}
          >
            <Text style={styles.feedbackButtonText}>Leave Feedback</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  bookingImage: {
    width: 98,
    height: 98,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    padding: 8,
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
    top: 10,
    right: 10,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
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
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  feedbackButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
});
