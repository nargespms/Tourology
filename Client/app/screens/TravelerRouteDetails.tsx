import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
} from "react-native";
import PagerView from "react-native-pager-view";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import {
  MOCK_IMAGES,
  REVIEWS,
  ROUTE_COORDS,
  STOPS,
} from "../data/routeDetailsMock";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import RouteDetailsGallery from "../components/RouteDetailGallery";
import TourHost from "../components/TourHost";
import TourStops from "../components/TourStops";
import TourReviews from "../components/TourReviews";

const { width } = Dimensions.get("window");

export default function TravelerRouteDetails() {
  const navigation = useNavigation();

  const scrollViewRef = useRef<ScrollView | null>(null);

  const [reviewsPositionY, setReviewsPositionY] = useState(0);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        ref={scrollViewRef}
      >
        <RouteDetailsGallery onGoBackTap={() => navigation.goBack()} />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>Lake Louise</Text>
          <Text style={styles.subTitle}>Southwestern Alberta, Canada</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.ratingReviews, { paddingRight: 8 }]}>
              ★4.8
            </Text>
            <TouchableOpacity onPress={scrollToReviews}>
              <Text style={styles.infoReviews}>74 reviews</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            Lake Louise, in Banff National Park, is a stunning turquoise lake
            surrounded by mountains...
          </Text>
        </View>

        <TourHost tourGuide={{ name: "John Doe", experience: 5 }} />

        <Text style={styles.sectionTitle}>Tour details</Text>

        <TourStops />
        <View onLayout={handleReviewsLayout}>
          <TourReviews />
        </View>
      </ScrollView>

      <View style={styles.stickyFooter}>
        <View style={{ flexDirection: "column", paddingLeft: 10 }}>
          <Text style={styles.priceText}>299 CAD</Text>
          <Text style={styles.tourDate}>Tour date 12 Jun</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => Alert.alert("Book", "Proceed to booking!")}
        >
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
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
  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
