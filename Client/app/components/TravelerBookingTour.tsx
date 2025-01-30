import React from "react";
import { StyleSheet, View, Text } from "react-native";

const TravelerBookingTour = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Traveler Booking Tour Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default TravelerBookingTour;
