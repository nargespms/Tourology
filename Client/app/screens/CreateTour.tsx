import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // optional for "Paid"/"Free"
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import ImagePickerSection from "../components/ImagePickerSection";
import AddStopModal from "../components/AddStopModal";
import StopListSection, { StopData } from "../components/StopListSection";
import { AntDesign } from "@expo/vector-icons";

export default function CreateTour() {
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [locationText, setLocationText] = useState("");

  // Map region state
  const [region, setRegion] = useState({
    latitude: 51.1784,
    longitude: -115.5708,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });

  // Pricing
  const [pricingOption, setPricingOption] = useState<"Paid" | "Free">("Paid");
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerTitle}>New tour</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={routeName}
            onChangeText={setRouteName}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiLineInput]}
            placeholder="Provide a short description about the tour and the location"
            placeholderTextColor="#b0acac"
            value={routeDescription}
            onChangeText={setRouteDescription}
            multiline
          />

          <Text style={styles.label}>Photos</Text>
          <ImagePickerSection
            images={galleryImages}
            onImagesChange={setGalleryImages}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Banff, Alberta, Canada"
            placeholderTextColor="#b0acac"
            value={locationText}
            onChangeText={handleLocationChange}
          />

          {/* Map (updates when location changes) */}
          <View style={styles.mapContainer}>
            <MapView style={styles.map} region={region}>
              <Marker coordinate={region} />
            </MapView>
          </View>

          {/* Stops Section */}
          <Text style={[styles.label, { marginTop: 20 }]}>Stops</Text>
          <StopListSection
            stops={stops}
            onEditStop={handleEditStopPress}
            onDeleteStop={handleDeleteStopPress}
          />
          {stops.length === 0 && (
            <Text style={styles.placeholderText}>
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
            <View style={styles.pickerRow}>
              <TouchableOpacity
                onPress={() => setPricingOption("Paid")}
                style={[
                  styles.pickerButton,
                  pricingOption === "Paid" && styles.pickerButtonActive,
                ]}
              >
                <Text
                  style={{
                    color: pricingOption === "Paid" ? "#fff" : "#000",
                  }}
                >
                  Paid
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPricingOption("Free")}
                style={[
                  styles.pickerButton,
                  pricingOption === "Free" && styles.pickerButtonActive,
                ]}
              >
                <Text
                  style={{
                    color: pricingOption === "Free" ? "#fff" : "#000",
                  }}
                >
                  Free
                </Text>
              </TouchableOpacity>
            </View>
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
            </>
          )}

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

          {/* Buttons at the bottom */}
          <View style={styles.buttonRow}>
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

        {/* 5.1) Add Stop Modal */}
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
    paddingBottom: 40,
    paddingHorizontal: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
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
  placeholderText: {
    marginTop: 4,
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 16,
  },
  pricingContainer: {
    marginTop: 16,
  },
  pickerRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  pickerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    alignItems: "center",
  },
  pickerButtonActive: {
    backgroundColor: "#007AFF",
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 20,
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
});
