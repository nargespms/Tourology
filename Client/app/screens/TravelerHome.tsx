import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";

import BottomNavBar from "../components/BottomNavBar";
import CustomTabs from "../components/CustomeTabs";
import SearchBar from "../components/SearchBar";
import TourCard, { Tour } from "../components/TourCard";
import { travelerNavbar } from "../data/navbarOptions";

// Sample data for each tab
const forYouData: Tour[] = [
  {
    id: "1",
    title: "Lake Louise",
    location: "Southwestern Alberta, Canada",
    price: "299 CAD",
    rating: 4.8,
    placeImage: require("../../assets/tour-temp3.png"),
    userName: "Sophia Bennett",
    userImage: require("../../assets/avatar.png"),
    isFree: false,
  },
  {
    id: "2",
    title: "Wascana Centre",
    location: "Regina, Saskatchewan",
    price: "399 CAD",
    rating: 4.8,
    placeImage: require("../../assets/tour-temp2.png"),
    userName: "Matthew Hamilton",
    userImage: require("../../assets/avatar.png"),
    isFree: true,
  },
  {
    id: "3",
    title: "Banff National Park",
    location: "Alberta, Canada",
    price: "450 CAD",
    rating: 4.7,
    placeImage: require("../../assets/tour-temp1.png"),
    userName: "Alice Tan",
    userImage: require("../../assets/avatar.png"),
  },
];

const followingData: Tour[] = [
  {
    id: "3",
    title: "Banff National Park",
    location: "Alberta, Canada",
    price: "450 CAD",
    rating: 4.7,
    placeImage: require("../../assets/tour-temp1.png"),
    userName: "Alice Tan",
    userImage: require("../../assets/avatar.png"),
  },
];

const freeData: Tour[] = [
  {
    id: "4",
    title: "Central Park",
    location: "New York, USA",
    price: "FREE Entry",
    rating: 4.9,
    placeImage: require("../../assets/choose-role.png"),
    userName: "John Doe",
    userImage: require("../../assets/avatar.png"),
    isFree: true,
  },
];

const TABS = [
  { label: "For you", value: "forYou" },
  { label: "Following", value: "following" },
  { label: "Free", value: "free" },
];

const TravelerHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState("forYou");
  const [searchValue, setSearchValue] = useState("");

  const navigation = useNavigation();

  const handleBottomNavChange = (name: string) => {
    if (name === "Bookings") {
      navigation.navigate("TravelerBookings" as never);
    }
  };

  let dataToRender: Tour[] = [];
  if (activeTab === "forYou") {
    dataToRender = forYouData;
  } else if (activeTab === "following") {
    dataToRender = followingData;
  } else if (activeTab === "free") {
    dataToRender = freeData;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Start your search"
        onSearch={(text) => console.log("Searching:", text)}
      />
      <CustomTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabPress={(val) => setActiveTab(val)}
      />

      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TourCard data={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      />

      <BottomNavBar
        items={travelerNavbar}
        currentTab={"Home"}
        onTabPress={(name) => handleBottomNavChange(name)}
      />
    </SafeAreaView>
  );
};

export default TravelerHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
});
