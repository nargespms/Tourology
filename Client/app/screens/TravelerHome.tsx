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
} from "react-native";
import * as Location from "expo-location";

import BottomNavBar from "../components/BottomNavBar";
import CustomTabs from "../components/CustomeTabs";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/TravelerSearchResult";
import LargePicTourCard from "../components/LargePicTourCard";
import { travelerNavbar } from "../data/navbarOptions";
import { Tour, followingData, forYouData, freeData } from "../data/tours";

const TABS = [
  { label: "For you", value: "forYou" },
  { label: "Following", value: "following" },
  { label: "Free", value: "free" },
];

const TravelerHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState("forYou");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Tour[]>([]);
  const [locationResults, setLocationResults] = useState<Tour[]>([]);

  const navigation = useNavigation();

  const handleBottomNavChange = (name: string) => {
    if (name === "Bookings") {
      navigation.navigate("TravelerBookings" as never);
    }
  };

  const fetchNearbyTours = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("User Location:", location.coords);

    setLocationResults([
      {
        id: "5",
        title: "Niagara Falls",
        location: "Ontario, Canada",
        price: "350 CAD",
        rating: 4.9,
        placeImage: require("../../assets/tour-temp3.png"),
        userName: "Emily Carter",
        userImage: require("../../assets/avatar.png"),
        isFree: false,
      },
    ]);
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
    setIsSearchOpen(query.length > 0);

    if (query.length > 0) {
      const filteredResults = forYouData.filter((tour) =>
        tour.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SearchBar
            placeholder="Start your search"
            onSearch={handleSearch}
            onClearSearch={() => setIsSearchOpen(false)}
            enableSearchResults={() => setIsSearchOpen(true)}
          />
          <View>
            <CustomTabs
              tabs={TABS}
              activeTab={activeTab}
              onTabPress={setActiveTab}
            />

            <FlatList
              data={
                activeTab === "forYou"
                  ? forYouData
                  : activeTab === "following"
                  ? followingData
                  : activeTab === "free"
                  ? freeData
                  : []
              }
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <LargePicTourCard
                  data={item}
                  onPressTour={() =>
                    navigation.navigate("TravelerRouteDetails" as never)
                  }
                />
              )}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: 190 },
              ]}
            />
            {/* Search Results Overlay */}
            {isSearchOpen && (
              <SearchResults
                searchQuery={searchValue}
                results={[...searchResults, ...locationResults]}
                onFetchNearbyTours={fetchNearbyTours}
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
  },
  listContent: {
    paddingHorizontal: 16,
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
