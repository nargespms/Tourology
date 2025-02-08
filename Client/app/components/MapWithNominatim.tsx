import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SingleLocationMap from "./SingleLocationMap";
import LocationSearchInput from "./locationSearchInput";

interface Props {
  onLocationSelect: (
    region: {
      type: "Point";
      coordinates: [number, number];
    },
    displayName: string
  ) => void;
}

export default function MapWithNominatim<Props>({ onLocationSelect }: Props) {
  const [region, setRegion] = useState({
    type: "Point",
    coordinates: [51.1784, -115.5708],
  });

  const handleLocationSelect = (
    lat: number,
    lon: number,
    displayName: string
  ) => {
    // Update the map region to the selected place
    setRegion((prev) => ({
      ...prev,
      type: "Point",
      coordinates: [lon, lat],
    }));
    onLocationSelect(region, displayName);

    // If you want to store `displayName` somewhere, do it here
  };

  return (
    <View style={styles.container}>
      <LocationSearchInput onLocationSelect={handleLocationSelect} />
      <SingleLocationMap region={region} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
