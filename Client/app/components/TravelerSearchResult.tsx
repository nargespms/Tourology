import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { nearbyTours, searchTours } from "../api/tours";
import AdvancedSearchOptions, { Filter } from "./AdvancedSearchOptions";
import CustomModal from "./CustomeModal";
import FilterTags from "./FilterTags";
import { Tour } from "./LargePicTourCard";
import SmallPicTourCard from "./SmallPicTourCard";

interface SearchResultsProps {
  searchQuery: string;
  onClose: () => void;
  clearSearch: () => void;
  filter?: Filter | null;
  onFilterChange?: (filter: Filter | null) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  onClose,
  clearSearch,
  filter: activeFilter,
  onFilterChange: setActiveFilter,
}) => {
  const queryClient = useQueryClient();

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const {
    isFetching,
    isFetched,
    data: searchResult,
    refetch,
  } = useQuery({
    queryKey: ["searchTours", searchQuery, activeFilter],
    queryFn: () =>
      searchTours({
        text: searchQuery,
        ...activeFilter,
      }),
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
    if (searchQuery.trim().length > 0 || activeFilter) {
      refetch();
    }
  }, [searchQuery, activeFilter]);

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

  const hasSearchQuery =
    (!!searchQuery && !!searchQuery.length) || !!activeFilter;
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
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#f1f1f1",
            }}
          >
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
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                Keyboard.dismiss();
                setIsFilterModalVisible(true);
              }}
            >
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <AntDesign name="filter" size={18} color="#007AFF" />
                <Text style={styles.nearbyText}>Filter</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Filter Tags */}
          {activeFilter && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                Keyboard.dismiss();
                setIsFilterModalVisible(true);
              }}
              style={{ borderBottomWidth: 1, borderBottomColor: "#f1f1f1" }}
            >
              <FilterTags filter={activeFilter} />
            </TouchableOpacity>
          )}

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
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item._id}
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

      <CustomModal
        visible={isFilterModalVisible}
        onClose={() => {
          setIsFilterModalVisible(false);
        }}
      >
        <AdvancedSearchOptions
          activeFilter={activeFilter}
          onSubmit={(filter) => {
            setActiveFilter(filter);
            setIsFilterModalVisible(false);
          }}
          onClose={() => {
            setIsFilterModalVisible(false);
          }}
        />
      </CustomModal>
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

    paddingVertical: 20,
  },

  nearbyText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
  },
});
