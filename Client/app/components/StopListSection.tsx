import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export interface StopData {
  id: string; // optional
  name: string;
  time: string;
  description: string;
  location: string;
  photo: string;
  region: {
    type: "Point";
    coordinates: [number, number];
  };
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
    <View>
      {stops.map((stop, index) => (
        <View style={styles.stopItem} key={index}>
          <Image source={{ uri: stop.photo }} style={styles.stopImage} />

          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={styles.stopTitle}>{stop.name}</Text>
            <Text style={[styles.stopDescription, { marginVertical: 6 }]}>
              {stop.time}
            </Text>
            <Text style={styles.stopDescription} numberOfLines={2}>
              {stop.description}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => onDeleteStop(index)}
            >
              <Text style={{ color: "red" }}>
                <Feather name="trash" size={18} color="red" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: "#eee",
                  borderColor: "#c4c4c4",
                  marginLeft: 12,
                },
              ]}
              onPress={() => onEditStop(index)}
            >
              <Text style={{ color: "#007AFF" }}>
                <Feather name="edit" size={18} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stopItem: {
    flexDirection: "row",
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  stopImage: {
    width: 80,
    height: 80,
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
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    borderWidth: 1,
  },
  deleteBtn: {
    borderColor: "red",
  },
});
