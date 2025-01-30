import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TourCard, { Tour } from "./TourCard";

interface SearchResultsProps {
  searchQuery: string;
  results: Tour[];
  onFetchNearbyTours: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  results,
  onFetchNearbyTours,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.searchResultContainer}>
        <TouchableOpacity
          style={styles.nearbyOption}
          onPress={() => {
            setLoading(true);
            onFetchNearbyTours();
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          <Ionicons name="location-outline" size={18} color="#007AFF" />
          <Text style={styles.nearbyText}>Search for nearby tours</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="small"
            color="#007AFF"
            style={{ paddingVertical: 16 }}
          />
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TourCard data={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchResults;
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Slight transparency
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchResultContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  nearbyOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  nearbyText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
  },
});
