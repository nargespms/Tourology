import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LargePicTourCard, { Tour } from "./LargePicTourCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { nearbyTours, searchTours } from "../api/tours";
import SmallPicTourCard from "./SmallPicTourCard";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

interface SearchResultsProps {
  searchQuery: string;
  onClose: () => void;
  clearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  onClose,
  clearSearch,
}) => {
  const queryClient = useQueryClient();

  const {
    isFetching,
    isFetched,
    data: searchResult,
    refetch,
  } = useQuery({
    queryKey: ["searchTours"],
    queryFn: () => searchTours(searchQuery),
    enabled: false,
    cacheTime: 0,
  });

  const {
    refetch: refetchNearby,
    data: nearbyResult,
    isFetched: isNearbyFetched,
    isFetching: isNearbyFetching,
  } = useQuery({
    queryKey: ["nearbyTours"],
    queryFn: nearbyTours,
    enabled: false,
    cacheTime: 0,
  });

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      refetch();
    }
  }, [searchQuery]);

  useEffect(() => {
    queryClient.removeQueries("searchTours");
    queryClient.removeQueries("nearbyTours");
  }, []);

  const navigation = useNavigation();

  const nav = (item: Tour) => {
    navigation.navigate({
      name: "TravelerRouteDetails",
      params: { tour: item },
    });
  };

  const fetchNearbyTours = () => {
    refetchNearby();
    clearSearch();
  };

  const hasSearchQuery = !!searchQuery && !!searchQuery.length;
  const result = hasSearchQuery ? searchResult : nearbyResult;
  const isLoading = isFetching || isNearbyFetching;
  const isLoaded = isFetched || isNearbyFetched;

  return (
    <SafeAreaView style={styles.overlay}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View style={styles.searchResultContainer}>
          <TouchableOpacity
            style={styles.nearbyOption}
            onPress={(e) => {
              e.stopPropagation();
              Keyboard.dismiss();
              fetchNearbyTours();
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <Ionicons name="location-outline" size={18} color="#007AFF" />
              <Text style={styles.nearbyText}>Search for nearby tours</Text>
            </View>
          </TouchableOpacity>

          {isLoading && (
            <ActivityIndicator
              size="small"
              color="#007AFF"
              style={{ paddingVertical: 10 }}
            />
          )}

          {isLoaded && !result?.length && (
            <Text style={{ alignSelf: "center", padding: 10 }}>
              No tours available.
            </Text>
          )}
          <View>
            {!!result?.length && !isLoading && (
              <FlatList
                data={result}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={(e) => {
                      e.stopPropagation();
                      Keyboard.dismiss();
                      nav(item);
                    }}
                  >
                    <SmallPicTourCard tour={item} enableButtons={false} />
                  </TouchableOpacity>
                )}
                contentContainerStyle={[
                  { paddingBottom: 190, gap: 15, padding: 15 },
                ]}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: "rgba(255, 255, 255, 0.98)", // Slight transparency
  },

  searchResultContainer: {
    height: "100%",
  },

  nearbyOption: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    paddingVertical: 20,
  },

  nearbyText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
  },
});
