import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PriceMarker = ({ currentValue }: { currentValue: number }) => (
  <View style={styles.markerContainer}>
    <View style={styles.priceBubble}>
      <Text style={styles.priceText}>${currentValue}</Text>
    </View>
    <View style={styles.thumbDot} />
  </View>
);

export default PriceMarker;
const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  priceBubble: {
    backgroundColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  priceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  thumbDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
  },
});
