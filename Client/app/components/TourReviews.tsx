import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getAvatar } from "../api/media";
import { Tour } from "../types/tour";
import { formatDate, pluralize } from "../utils/formats";

type TourReviewProps = {
  tour: Tour;
};

const TourReviews = (props: TourReviewProps) => {
  const { tour } = props;

  const reviews = Object.values(tour.reviews ?? {});

  return (
    <View style={styles.reviewsContainer}>
      {reviews.length !== 0 && (
        <Text style={styles.sectionTitle}>
          ★ {tour.rating?.toPrecision(2)} –{" "}
          {pluralize(reviews.length, "review")}
        </Text>
      )}
      {reviews.length === 0 && (
        <Text style={styles.sectionTitle}>No reviews yet</Text>
      )}

      {reviews.map((review) => (
        <View style={styles.reviewCard} key={review._id}>
          <Text style={styles.reviewRating}>
            {`★`.repeat(Math.round(review.rating)) +
              `☆`.repeat(5 - Math.round(review.rating))}{" "}
            {formatDate(review.date)}
          </Text>
          <Text style={styles.reviewText}>{review.description}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: getAvatar(review.user.id) }}
              style={styles.avatar}
            />
            <Text style={styles.reviewAuthor}>{review.user.name}</Text>
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
    fontWeight: "400",
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
