import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AddStopModal from "../components/AddStopModal";
import ImagePickerSection from "../components/ImagePickerSection";
import StopListSection, { StopData } from "../components/StopListSection";
import SingleLocationMap from "../components/SingleLocationMap";
import PickerButton from "../components/PickerButton";

export default function CreateTour() {
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [locationText, setLocationText] = useState("");

  const navigation = useNavigation();

  // Map region state
  const [region, setRegion] = useState({
    latitude: 51.1784,
    longitude: -115.5708,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });

  // Pricing
  const [pricingOption, setPricingOption] = useState<string>("Paid");
  const [price, setPrice] = useState("299");
  const [maxAttendees, setMaxAttendees] = useState("10");

  // Dates
  const [startDate, setStartDate] = useState("12 Jun 2025");
  const [endDate, setEndDate] = useState("13 Jun 2025");

  // Stops
  const [stops, setStops] = useState<StopData[]>([]);

  // Add Stop Modal
  const [isStopModalVisible, setIsStopModalVisible] = useState(false);
  const [editingStopIndex, setEditingStopIndex] = useState<number | null>(null);

  useEffect(() => {
    // On mount, request location permissions (for geocode use)
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const handleLocationChange = async (text: string) => {
    setLocationText(text);
    try {
      const geoResult = await Location.geocodeAsync(text);
      if (geoResult.length > 0) {
        setRegion({
          latitude: geoResult[0].latitude || region.latitude,
          longitude: geoResult[0].longitude || region.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        });
      }
    } catch (error) {
      console.log("Geocode error:", error);
      // fallback: do nothing or show an alert
    }
  };

  const handleAddStopPress = () => {
    setEditingStopIndex(null); // new stop
    setIsStopModalVisible(true);
  };

  const handleEditStopPress = (index: number) => {
    setEditingStopIndex(index);
    setIsStopModalVisible(true);
  };

  const handleDeleteStopPress = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveStop = (newStop: StopData) => {
    if (editingStopIndex !== null) {
      // editing
      setStops((prev) =>
        prev.map((s, i) => (i === editingStopIndex ? newStop : s))
      );
    } else {
      // adding new
      setStops((prev) => [...prev, newStop]);
    }
  };

  const handleSaveDraft = () => {
    Alert.alert("Draft Saved", "Your route draft has been saved locally.");
  };

  const handleSave = () => {
    // Validate & send data to server
    Alert.alert("Route Saved", "Your new tour route has been saved!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.newTourStickyHeader}>
          <TouchableOpacity
            style={[styles.topButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.topButtonText}>
              <Ionicons name="arrow-back" size={18} />
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New tour</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={routeName}
            onChangeText={setRouteName}
          />
          <Text style={[styles.label]}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiLineInput]}
            placeholder="Provide a short description about the tour and the location"
            placeholderTextColor="#b0acac"
            value={routeDescription}
            onChangeText={setRouteDescription}
            multiline
          />

          <Text style={styles.label}>City/ Province/ State</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Banff, Alberta, Florida"
            placeholderTextColor="#b0acac"
            value={locationText}
            onChangeText={handleLocationChange}
          />

          {/* Map (updates when location changes) */}
          <SingleLocationMap region={region} />

          {/* Stops Section */}
          <Text style={[styles.label, { marginTop: 20 }]}>Stops</Text>
          <StopListSection
            stops={stops}
            onEditStop={handleEditStopPress}
            onDeleteStop={handleDeleteStopPress}
          />
          {stops.length === 0 && (
            <Text style={styles.placeholderStopText}>
              No stops added yet. Please add the first stop.
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.addStopBtn,
              { justifyContent: "center", alignItems: "center" },
            ]}
            onPress={handleAddStopPress}
          >
            <AntDesign
              name="plus"
              size={16}
              color="black"
              style={{ fontWeight: "600" }}
            />
            <Text style={styles.addStopBtnText}> Add stop</Text>
          </TouchableOpacity>

          {/* 6) Pricing Options */}
          <View style={styles.pricingContainer}>
            <Text style={styles.label}>Pricing option</Text>

            <PickerButton
              options={["Paid", "Free"]}
              activeOption={pricingOption}
              onSelect={(option) => setPricingOption(option)}
            />
          </View>
          {pricingOption === "Paid" && (
            <>
              <Text style={styles.label}>Price (CAD)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />

              <Text style={styles.label}>Max attendees</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={maxAttendees}
                onChangeText={setMaxAttendees}
              />
              <Text style={styles.label}>Start date</Text>
              <TextInput
                style={styles.input}
                placeholder="DD MMM YYYY"
                value={startDate}
                onChangeText={setStartDate}
              />

              <Text style={styles.label}>End date</Text>
              <TextInput
                style={styles.input}
                placeholder="DD MMM YYYY"
                value={endDate}
                onChangeText={setEndDate}
              />
            </>
          )}

          <Text style={styles.label}>Photos</Text>
          <ImagePickerSection
            images={galleryImages}
            onImagesChange={setGalleryImages}
          />

          <View style={{ flexDirection: "row", marginTop: 16 }}>
            <TouchableOpacity
              style={styles.draftButton}
              onPress={handleSaveDraft}
            >
              <Text>Save as draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <AddStopModal
          visible={isStopModalVisible}
          onClose={() => setIsStopModalVisible(false)}
          onSaveStop={handleSaveStop}
          existingStop={
            editingStopIndex !== null ? stops[editingStopIndex] : null
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 70,
    paddingHorizontal: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingLeft: 12,
  },
  newTourStickyHeader: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    zIndex: 2,
    backgroundColor: "#f4f3f3",
  },
  topButton: {
    zIndex: 2,
    width: 32,
    height: 32,
    backgroundColor: "#4b4b4b",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  topButtonText: {
    color: "#fff",
    fontSize: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  multiLineInput: {
    height: 80,
    textAlignVertical: "top",
    paddingHorizontal: 8,
  },
  mapContainer: {
    marginTop: 8,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  addStopBtn: {
    flexDirection: "row",
    marginTop: 8,
    width: "100%",
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  addStopBtnText: {
    fontWeight: "600",
  },
  placeholderStopText: {
    marginTop: 4,
    color: "#757575",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#969696",
    borderRadius: 8,
  },
  pricingContainer: {
    marginTop: 16,
  },

  draftButton: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: "center",
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
