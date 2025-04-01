import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Alert,
} from "react-native";
import * as Location from "expo-location";

import BottomNavBar from "../components/BottomNavBar";
import CustomTabs from "../components/CustomeTabs";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/TravelerSearchResult";
import LargePicTourCard from "../components/LargePicTourCard";
import { travelerNavbar } from "../data/navbarOptions";
import { Tour, followingData, forYouData, freeData } from "../data/tours";
import { useQuery } from "@tanstack/react-query";
import { getTours, searchTours } from "../api/tours";

const TABS = [
  { label: "For you", value: "" },
  { label: "Following", value: "followed" },
  { label: "Free", value: "free" },
  { label: "Favorites", value: "favorite" },
];

const TravelerHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = useNavigation();

  const { isFetching, data } = useQuery({
    queryKey: ["tours", activeTab],
    queryFn: () => getTours(activeTab),
  });

  const handleBottomNavChange = (name: string) => {
    if (name === "Bookings") {
      navigation.navigate("TravelerBookings" as never);
    } else if (name === "Favorites") {
      Alert.alert("Coming soon", "This feature is not available yet.");
    } else if (name === "Profile") {
      Alert.alert("Coming soon", "This feature is not available yet.");
    }
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
    setIsSearchOpen(query.length > 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SearchBar
            value={searchValue}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Start your search"
            onSearch={handleSearch}
          />
          <View style={{ flex: 1 }}>
            <CustomTabs
              tabs={TABS}
              activeTab={activeTab}
              onTabPress={setActiveTab}
            />

            {isFetching && (
              <Text style={{ alignSelf: "center", padding: 10 }}>
                Loading...
              </Text>
            )}
            {!isFetching && data && data.length === 0 && (
              <Text style={{ alignSelf: "center", padding: 10 }}>
                No tours available
              </Text>
            )}
            {!isFetching && data && (
              <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <LargePicTourCard
                    data={item}
                    key={item._id}
                    onPressTour={() =>
                      navigation.navigate({
                        name: "TravelerRouteDetails",
                        params: { tour: item },
                      })
                    }
                  />
                )}
                contentContainerStyle={[
                  styles.listContent,
                  { paddingBottom: 190 },
                ]}
              />
            )}
            {isSearchOpen && (
              <SearchResults
                searchQuery={searchValue}
                onClose={() => {
                  setIsSearchOpen(false);
                  setSearchValue("");
                }}
                clearSearch={() => {
                  setSearchValue("");
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>

      <View style={styles.navbarWrapper}>
        <BottomNavBar
          items={travelerNavbar}
          currentTab={"Home"}
          onTabPress={handleBottomNavChange}
        />
      </View>
    </SafeAreaView>
  );
};

export default TravelerHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#fff",
  },
});
