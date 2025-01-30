import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { MOCK_IMAGES } from "../data/routeDetailsMock";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface RouteDetailsGalleryProps {
  onGoBackTap: () => void;
}

const RouteDetailsGallery: React.FC<RouteDetailsGalleryProps> = ({
  onGoBackTap,
}) => {
  const [activePage, setActivePage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePageSelected = (e: any) => {
    setActivePage(e.nativeEvent.position);
  };

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
    Alert.alert("Favorite", "Route added to favorites!");
  };

  return (
    <View style={styles.galleryContainer}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {MOCK_IMAGES.map((img, index) => (
          <View style={styles.imageSlide} key={index}>
            <Image source={img} style={styles.galleryImage} />
          </View>
        ))}
      </PagerView>

      <TouchableOpacity
        style={[styles.topButton, styles.backButton]}
        onPress={() => onGoBackTap()}
      >
        <Text style={styles.topButtonText}>
          <Ionicons name="arrow-back" size={18} />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.topButton, styles.favoriteButton]}
        onPress={handleFavorite}
      >
        <Text style={styles.topButtonText}>
          {isFavorite ? (
            <MaterialIcons name="favorite-outline" size={16} />
          ) : (
            <MaterialIcons name="favorite" size={16} />
          )}
        </Text>
      </TouchableOpacity>
      <View style={styles.paginationContainer}>
        {MOCK_IMAGES.map((_, i) => {
          return (
            <View
              key={i}
              style={[styles.dot, i === activePage && styles.activeDot]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#000",
  },
  pagerView: {
    flex: 1,
  },
  imageSlide: {
    width: "100%",
    height: "100%",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  topButton: {
    position: "absolute",
    top: 20,
    zIndex: 2,
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  topButtonText: {
    color: "#393939",
    fontSize: 18,
  },
  backButton: {
    left: 10,
  },
  favoriteButton: {
    right: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
});

export default RouteDetailsGallery;
