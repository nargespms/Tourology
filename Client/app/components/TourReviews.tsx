import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { REVIEWS } from "../data/routeDetailsMock";

const TourReviews = () => {
  return (
    <View style={styles.reviewsContainer}>
      <Text style={styles.sectionTitle}>★4.8 – 74 reviews</Text>

      {REVIEWS.map((review) => (
        <View style={styles.reviewCard} key={review.id}>
          <Text style={styles.reviewRating}>
            {`★`.repeat(Math.round(review.rating))} {review.date}
          </Text>
          <Text style={styles.reviewText}>{review.text}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/avatar.png")}
              style={styles.avatar}
            />
            <Text style={styles.reviewAuthor}>{review.author}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 25,
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 10,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: "#DDDCDB",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  reviewRating: {
    fontWeight: "600",
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
  },
  reviewAuthor: {
    fontSize: 13,
    color: "#777",
    fontStyle: "italic",
  },
});

export default TourReviews;
