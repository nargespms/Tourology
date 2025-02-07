import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import StopForm, { StopFormData } from "./StopForm";
import { StopData } from "./StopListSection";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaveStop: (stop: StopData) => void;
  existingStop: StopData | null;
}

export default function AddStopModal({
  visible,
  onClose,
  onSaveStop,
  existingStop,
}: Props) {
  // If editing, initialize the form data with existing stop
  const initialForm: StopFormData = existingStop
    ? {
        name: existingStop.name,
        time: existingStop.time,
        description: existingStop.description,
        location: existingStop.location,
        photo: existingStop.photo,
        region: existingStop.region,
      }
    : {
        name: "",
        time: "12:00 AM",
        description: "",
        location: "",
        photo: "",
        region: {
          latitude: 51.1784,
          longitude: -115.5708,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        },
      };

  const [formData, setFormData] = useState<StopFormData>(initialForm);

  useEffect(() => {
    if (existingStop) {
      setFormData({
        name: existingStop.name,
        time: existingStop.time,
        description: existingStop.description,
        location: existingStop.location,
        photo: existingStop.photo,
        region: existingStop.region,
      });
    } else {
      setFormData(initialForm);
    }
  }, [existingStop]);

  const handleDiscard = () => {
    onClose();
  };

  const handleAdd = () => {
    if (!formData.name) {
      // Simple validation
      return;
    }
    // Compose StopData
    const newStop: StopData = {
      name: formData.name,
      time: formData.time,
      description: formData.description,
      location: formData.location,
      photo: formData.photo,
      region: formData.region,
    };
    onSaveStop(newStop);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {existingStop ? "Edit stop" : "Add stop"}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>
              <Ionicons name="close" size={24} />
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.modalContainer}>
            <StopForm formData={formData} onFormChange={setFormData} />

            {/* ACTION BUTTONS */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.discardBtn}
                onPress={handleDiscard}
              >
                <Text>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={{ color: "#fff" }}>
                  {existingStop ? "Save" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    marginHorizontal: 18,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    zIndex: 2,
    backgroundColor: "#f4f3f3",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeText: {
    fontSize: 20,
    color: "gray",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 40,
  },
  discardBtn: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: "center",
  },
});
