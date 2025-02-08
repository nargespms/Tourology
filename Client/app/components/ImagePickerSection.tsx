import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface Props {
  images: string[]; // URIs
  onImagesChange: (updated: string[]) => void;
}

export default function ImagePickerSection({ images, onImagesChange }: Props) {
  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets) {
      const newUri = result.assets[0].uri;
      onImagesChange([...images, newUri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <View style={styles.container}>
      {images.map((uri, index) => (
        <View style={styles.imageWrapper} key={index}>
          <Image source={{ uri }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveImage(index)}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addTile} onPress={handleAddImage}>
        <Text style={{ fontSize: 24, color: "#999" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageWrapper: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
  },
  removeButtonText: {
    fontSize: 14,
    color: "red",
  },
  addTile: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
});
