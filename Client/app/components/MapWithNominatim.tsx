import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SingleLocationMap from "./SingleLocationMap";
import LocationSearchInput from "./locationSearchInput";

interface Props {
  onLocationSelect: (
    latitude: string,
    longitude: string,
    latitudeDelta: string,
    longitudeDelta: string
  ) => void;
}

export default function MapWithNominatim<Props>({ onLocationSelect }: Props) {
  const [region, setRegion] = useState({
    latitude: 51.1784,
    longitude: -115.5708,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });

  const handleLocationSelect = (
    lat: number,
    lon: number,
    displayName: string
  ) => {
    // Update the map region to the selected place
    setRegion((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      // Optionally zoom in closer
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }));
    onLocationSelect(region);

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
