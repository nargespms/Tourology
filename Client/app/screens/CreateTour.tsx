import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
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

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTour } from "../api/tours";
import AddStopModal from "../components/AddStopModal";
import ImagePickerSection from "../components/ImagePickerSection";
import PickerButton from "../components/PickerButton";
import SingleLocationMap from "../components/SingleLocationMap";
import StopListSection, { StopData } from "../components/StopListSection";
import getId from "../utils/getId";
import { getUserInfo } from "../utils/userSession";
import Toast from "react-native-toast-message";

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
  const [price, setPrice] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");

  // Dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Stops
  const [stops, setStops] = useState<StopData[]>([]);

  // Add Stop Modal
  const [isStopModalVisible, setIsStopModalVisible] = useState(false);
  const [editingStopIndex, setEditingStopIndex] = useState<number | null>(null);

  const queryClient = useQueryClient();

  //local error state for inputs
  const [errors, setErrors] = useState({
    routeName: false,
    routeDescription: false,
    locationText: false,
    price: false,
    maxAttendees: false,
    startDate: false,
    endDate: false,
    photos: false,
  });

  const { mutate } = useMutation({
    mutationFn: createTour,
    onSuccess: () => {
      // If successful, reset or navigate
      navigation.goBack();
      queryClient.invalidateQueries("tourGuideTours");
    },
    onError: () => {
      // Could handle error toast or something else here
    },
  });

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
      // fallback: do nothing
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
  const handleSetGalleryImages = (images: string[]) => {
    setGalleryImages(images);
    if (errors.photos && images.length > 0) {
      setErrors((prev) => ({ ...prev, photos: false }));
    }
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
    handleSave("draft");
  };

  const handleSave = async (state = "published") => {
    // error object for validations
    const newErrors = {
      routeName: !routeName.trim(),
      routeDescription: !routeDescription.trim(),
      locationText: !locationText.trim(),
      price: false,
      maxAttendees: false,
      startDate: false,
      endDate: false,
      photos: galleryImages.length === 0,
    };

    // If pricing is Paid, validate required fields too
    if (pricingOption === "Paid") {
      newErrors.price = !price.trim();
      newErrors.maxAttendees = !maxAttendees.trim();
      newErrors.startDate = !startDate.trim();
      newErrors.endDate = !endDate.trim();
    }

    setErrors(newErrors);

    // If any error is true, stop here
    if (Object.values(newErrors).some((val) => val === true)) {
      Toast.show({
        type: "error",
        text1: "Please fill in all required fields",
        visibilityTime: 5000,
        topOffset: 50,
      });
      return;
    }

    // passing all validations
    const user = await getUserInfo();
    mutate({
      name: routeName,
      state,
      description: routeDescription,
      location: locationText,
      region: region,
      paid: pricingOption === "Paid",
      price: pricingOption === "Paid" ? parseFloat(price) : 0,
      maxAttendees: parseInt(maxAttendees),
      startDate: startDate,
      endDate: endDate,
      stops: stops.reduce((acc, stop) => {
        const id = getId();
        acc[id] = stop;
        stop.id = id;
        return acc;
      }, {} as Record<string, StopData>),
      photos: galleryImages,
      host: {
        id: user.id,
        name: user.profileName ?? user.firstName + " " + user.lastName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
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

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            style={[styles.input, errors.routeName && styles.errorInput]}
            value={routeName}
            placeholderTextColor="#999"
            placeholder="e.g. Banff National Park Tour"
            onChangeText={(txt) => {
              setRouteName(txt);
              if (errors.routeName && txt.trim()) {
                setErrors((prev) => ({ ...prev, routeName: false }));
              }
            }}
          />

          <Text style={[styles.label]}>Description*</Text>
          <TextInput
            style={[
              styles.input,
              styles.multiLineInput,
              errors.routeDescription && styles.errorInput,
            ]}
            placeholder="Provide a short description about the tour and the location"
            placeholderTextColor="#999"
            value={routeDescription}
            onChangeText={(txt) => {
              setRouteDescription(txt);
              if (errors.routeDescription && txt.trim()) {
                setErrors((prev) => ({ ...prev, routeDescription: false }));
              }
            }}
            multiline
          />

          <Text style={styles.label}>City/ Province/ State*</Text>
          <TextInput
            style={[styles.input, errors.locationText && styles.errorInput]}
            placeholder="e.g. Banff, Alberta, Florida"
            placeholderTextColor="#999"
            value={locationText}
            onChangeText={(txt) => {
              setLocationText(txt);
              if (errors.locationText && txt.trim()) {
                setErrors((prev) => ({ ...prev, locationText: false }));
              }
              handleLocationChange(txt);
            }}
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

          {/* Pricing Options */}
          <View style={styles.pricingContainer}>
            <Text style={styles.label}>Pricing option</Text>

            <PickerButton
              options={["Paid", "Free"]}
              activeOption={pricingOption}
              onSelect={(option) => setPricingOption(option)}
            />
          </View>

          {/* Paid Only Fields */}
          {pricingOption === "Paid" && (
            <>
              <Text style={styles.label}>Price (CAD)*</Text>
              <TextInput
                style={[styles.input, errors.price && styles.errorInput]}
                keyboardType="numeric"
                placeholderTextColor="#999"
                placeholder="e.g. 100"
                value={price}
                onChangeText={(txt) => {
                  setPrice(txt);
                  if (errors.price && txt.trim()) {
                    setErrors((prev) => ({ ...prev, price: false }));
                  }
                }}
              />

              <Text style={styles.label}>Max attendees*</Text>
              <TextInput
                style={[styles.input, errors.maxAttendees && styles.errorInput]}
                keyboardType="numeric"
                placeholderTextColor="#999"
                placeholder="e.g. 10"
                value={maxAttendees}
                onChangeText={(txt) => {
                  setMaxAttendees(txt);
                  if (errors.maxAttendees && txt.trim()) {
                    setErrors((prev) => ({ ...prev, maxAttendees: false }));
                  }
                }}
              />

              <Text style={styles.label}>Start date*</Text>
              <TextInput
                style={[styles.input, errors.startDate && styles.errorInput]}
                placeholder="DD MMM YYYY: e.g. 01 Jan 2025"
                placeholderTextColor="#999"
                value={startDate}
                onChangeText={(txt) => {
                  setStartDate(txt);
                  if (errors.startDate && txt.trim()) {
                    setErrors((prev) => ({ ...prev, startDate: false }));
                  }
                }}
              />

              <Text style={styles.label}>End date*</Text>
              <TextInput
                style={[styles.input, errors.endDate && styles.errorInput]}
                placeholder="DD MMM YYYY: e.g. 01 Jan 2025"
                placeholderTextColor="#999"
                value={endDate}
                onChangeText={(txt) => {
                  setEndDate(txt);
                  if (errors.endDate && txt.trim()) {
                    setErrors((prev) => ({ ...prev, endDate: false }));
                  }
                }}
              />
            </>
          )}

          {/* Photos (required?) */}
          <Text style={styles.label}>Photos</Text>
          <ImagePickerSection
            images={galleryImages}
            onImagesChange={handleSetGalleryImages}
          />
          {errors.photos && (
            <Text style={styles.errorText}>
              At least one photo is required.
            </Text>
          )}
        </ScrollView>

        {/* Sticky bottom action bar */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.draftButton}
            onPress={handleSaveDraft}
          >
            <Text>Save as draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSave("published")}
          >
            <Text style={{ color: "#fff" }}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Stop Modal */}
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
    paddingBottom: 150,
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
    backgroundColor: "#f4f3f3",
    zIndex: 2,
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
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 2,
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
    color: "#a4a4a4",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
  },
  pricingContainer: {
    marginTop: 16,
  },

  // Sticky bottom button container
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  draftButton: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
