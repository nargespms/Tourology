import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import SingleLocationMap from "./SingleLocationMap";

export interface StopFormData {
  name: string;
  time: string;
  description: string;
  location: string;
  region?: {
    latitude: number;
    longitude: number;
  };
  photo: string; // one photo
}

interface Props {
  formData: StopFormData;
  onFormChange: (updated: StopFormData) => void;
  errors?: {
    name: boolean;
    time: boolean;
    description: boolean;
    location: boolean;
    photo: boolean;
  };
}

export default function StopForm({ formData, onFormChange, errors }: Props) {
  const [region, setRegion] = React.useState({
    latitude: 51.1784,
    longitude: -115.5708,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });

  // Update region if location text changes
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (formData.location) {
          const geoResult = await Location.geocodeAsync(formData.location);
          if (geoResult.length > 0 && isMounted) {
            setRegion({
              latitude: geoResult[0].latitude ?? region.latitude,
              longitude: geoResult[0].longitude ?? region.longitude,
              latitudeDelta: 1,
              longitudeDelta: 1,
            });
          }
        }
      } catch (e) {
        // handle error
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [formData.location]);

  // update parent formData if region changes
  useEffect(() => {
    onFormChange({ ...formData, region });
  }, [region]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets) {
      onFormChange({ ...formData, photo: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name*</Text>
      <TextInput
        style={[styles.input, errors?.name && styles.errorInput]}
        value={formData.name}
        placeholder="e.g. Lake Louise"
        placeholderTextColor="#999"
        onChangeText={(val) => onFormChange({ ...formData, name: val })}
      />

      <Text style={styles.label}>Expected time*</Text>
      <TextInput
        style={[styles.input, errors?.time && styles.errorInput]}
        value={formData.time}
        placeholder="e.g. 12:00 AM"
        placeholderTextColor="#999"
        onChangeText={(val) => onFormChange({ ...formData, time: val })}
      />

      <Text style={styles.label}>Description*</Text>
      <TextInput
        style={[
          styles.input,
          styles.multiLine,
          errors?.description && styles.errorInput,
        ]}
        multiline
        value={formData.description}
        onChangeText={(val) => onFormChange({ ...formData, description: val })}
        placeholder="Provide a short description about the tour and the location"
        placeholderTextColor="#b0acac"
      />

      <Text style={styles.label}>Location*</Text>
      <TextInput
        style={[styles.input, errors?.location && styles.errorInput]}
        placeholder="e.g. Lake Louise"
        placeholderTextColor="#999"
        value={formData.location}
        onChangeText={(val) => onFormChange({ ...formData, location: val })}
      />

      {/* MAP PREVIEW */}
      <SingleLocationMap region={region} />

      <Text style={styles.label}>Photo*</Text>
      <View style={styles.photoRow}>
        {formData.photo ? (
          <View style={styles.photoWrapper}>
            <Image source={{ uri: formData.photo }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onFormChange({ ...formData, photo: "" })}
            >
              <Text style={{ color: "red" }}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
          <Text style={{ fontSize: 20, color: "#999" }}>+</Text>
        </TouchableOpacity>
      </View>
      {errors?.photo && (
        <Text style={styles.errorText}>Photo is required.</Text>
      )}
    </ScrollView>
  );
}

// -----------------------------------
const styles = StyleSheet.create({
  container: {
    marginBottom: 80,
    paddingBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  multiLine: {
    height: 80,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  photoWrapper: {
    width: 80,
    height: 80,
    marginRight: 8,
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  addPhoto: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
