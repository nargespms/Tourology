import React from "react";
import { Text, View, StyleSheet } from "react-native";

const TourGuideHome: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tour Guide Home</Text>
    </View>
  );
};

export default TourGuideHome;

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
