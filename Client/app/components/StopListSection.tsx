import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export interface StopData {
  id?: string; // optional
  name: string;
  time: string;
  description: string;
  location: string;
  imageUri: string;
}

interface Props {
  stops: StopData[];
  onEditStop: (index: number) => void;
  onDeleteStop: (index: number) => void;
}

export default function StopListSection({
  stops,
  onEditStop,
  onDeleteStop,
}: Props) {
  return (
    <View style={styles.container}>
      {stops.map((stop, index) => (
        <View style={styles.stopItem} key={index}>
          {/* Stop image */}
          <Image source={{ uri: stop.imageUri }} style={styles.stopImage} />

          {/* Stop details */}
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={styles.stopTitle}>
              {stop.name} – {stop.time}
            </Text>
            <Text style={styles.stopDescription} numberOfLines={2}>
              {stop.description}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#eee" }]}
              onPress={() => onDeleteStop(index)}
            >
              <Text style={{ color: "red" }}>🗑</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#eee" }]}
              onPress={() => onEditStop(index)}
            >
              <Text style={{ color: "#007AFF" }}>✎</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  stopItem: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  stopImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },
  stopTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  stopDescription: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
});
