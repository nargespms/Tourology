import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import SkeletonPlaceholder from "./SkeletonPlaceholder";
import { Tour } from "../types/tour";
import { getAvatar, getMediaSrc } from "../api/media";
import { formatPrice } from "../utils/formats";

type TourCardProps = {
  data: Tour;
  onPressTour?: (tour: Tour) => void;
};

const LargePicTourCard: React.FC<TourCardProps> = ({ data, onPressTour }) => {
  const { name, location, paid, price, rating, photos, host, _id } = data;

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={(data) => onPressTour(data)}
    >
      <View style={styles.imageWrapper}>
        {!imageLoaded && (
          <SkeletonPlaceholder width="100%" height={160} borderRadius={12} />
        )}
        <Image
          source={{ uri: getMediaSrc(photos[0]) }}
          style={[styles.placeImage, !imageLoaded && { opacity: 0 }]}
          resizeMode="cover"
          onLoad={handleImageLoad}
        />

        <View style={styles.overlayContainer}>
          {host && host.name && (
            <View style={styles.userOverlay}>
              <Image
                source={{ uri: getAvatar(host.id) }}
                style={styles.userAvatar}
                resizeMode="cover"
              />
              <Text style={styles.userName}>{host.name}</Text>
            </View>
          )}

          {!paid && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoContainerFirstRow}>
          <Text style={styles.title}>{name}</Text>
          {rating && (
            <Text style={styles.ratingText}>★ {rating?.toFixed(1)}</Text>
          )}
        </View>
        <Text style={styles.location}>{location}</Text>
        {paid && <Text style={styles.price}>{formatPrice(price)}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default LargePicTourCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  placeImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 160,
  },
  overlayContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: 12,
  },
  userOverlay: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  userName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  freeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  infoContainer: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  infoContainerFirstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },

  ratingText: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
    flexDirection: "row",
  },
});
