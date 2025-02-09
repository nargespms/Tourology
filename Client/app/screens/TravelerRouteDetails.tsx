import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { bookATour, isTourBooked } from "../api/tours";
import RouteDetailsGallery from "../components/RouteDetailGallery";
import TourHost from "../components/TourHost";
import TourReviews from "../components/TourReviews";
import TourStops from "../components/TourStops";
import { formatDate, formatPrice, pluralize } from "../utils/formats";

const { width } = Dimensions.get("window");

export default function TravelerRouteDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tour } = route.params;

  const scrollViewRef = useRef<ScrollView | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [reviewsPositionY, setReviewsPositionY] = useState(0);

  const { mutate: book } = useMutation({
    mutationFn: () => bookATour(tour._id),
    onSuccess: () => {
      Alert.alert("Success", "Tour booked successfully");
      setIsBooked(true);
    },
  });

  const { data } = useQuery({
    queryKey: ["isBooked", tour._id],
    queryFn: () => isTourBooked(tour._id),
  });

  useEffect(() => {
    if (data) {
      setIsBooked(true);
    }
  }, [data]);

  const handleReviewsLayout = (e: NativeSyntheticEvent<LayoutChangeEvent>) => {
    const { y } = e.nativeEvent.layout;
    setReviewsPositionY(y);
  };

  const scrollToReviews = () => {
    scrollViewRef.current?.scrollTo({
      y: reviewsPositionY,
      animated: true,
    });
  };

  const reviewsLength = Object.keys(tour.reviews || {}).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        ref={scrollViewRef}
      >
        <RouteDetailsGallery
          tour={tour}
          onGoBackTap={() => navigation.goBack()}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{tour.name}</Text>
          <Text style={styles.subTitle}>{tour.location}</Text>
          <View style={{ flexDirection: "row" }}>
            {tour.rating && (
              <Text style={[styles.ratingReviews, { paddingRight: 8 }]}>
                ★{tour.rating}
              </Text>
            )}
            <TouchableOpacity
              onPress={reviewsLength > 0 ? scrollToReviews : undefined}
            >
              {reviewsLength > 0 && (
                <Text style={styles.infoReviews}>
                  {pluralize(reviewsLength, "review")}
                </Text>
              )}
              {reviewsLength === 0 && <Text>No reviews</Text>}
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{tour.description}</Text>
        </View>

        <TourHost {...tour.host} />

        <Text style={styles.sectionTitle}>Tour details</Text>

        <TourStops tour={tour} />

        <View onLayout={handleReviewsLayout}>
          <TourReviews tour={tour} />
        </View>
      </ScrollView>

      <View style={styles.stickyFooter}>
        <View style={{ flexDirection: "column", paddingLeft: 10 }}>
          <Text style={styles.priceText}>
            {tour.paid ? formatPrice(tour.price) : "Free"}
          </Text>
          <Text style={styles.tourDate}>{formatDate(tour.startDate)}</Text>
        </View>
        {tour.state === "published" && tour.paid && !isBooked && (
          <TouchableOpacity style={styles.bookButton} onPress={book}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        )}
        {tour.state === "published" && tour.paid && isBooked && (
          <TouchableOpacity style={styles.bookedButton} disabled>
            <Text style={styles.bookButtonText}>Booked</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  infoReviews: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
  },
  ratingReviews: {
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginVertical: 16,
  },

  // STICKY FOOTER
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    paddingBottom: 34,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 16,
  },
  tourDate: {
    fontSize: 12,
    color: "#777",
    marginRight: 16,
  },
  bookButton: {
    marginLeft: "auto",
    backgroundColor: "#007AFF",
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 6,
  },
  bookedButton: {
    marginLeft: "auto",
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
