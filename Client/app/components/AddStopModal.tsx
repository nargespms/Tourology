import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import StopForm, { StopFormData } from "./StopForm";
import { StopData } from "./StopListSection";

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
        imageUri: existingStop.imageUri,
      }
    : {
        name: "",
        time: "12:00 AM",
        description: "",
        location: "",
        imageUri: "",
      };

  const [formData, setFormData] = useState<StopFormData>(initialForm);

  useEffect(() => {
    if (existingStop) {
      setFormData({
        name: existingStop.name,
        time: existingStop.time,
        description: existingStop.description,
        location: existingStop.location,
        imageUri: existingStop.imageUri,
      });
    } else {
      setFormData({
        name: "",
        time: "12:00 AM",
        description: "",
        location: "",
        imageUri: "",
      });
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
      imageUri: formData.imageUri,
    };
    onSaveStop(newStop);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {existingStop ? "Edit stop" : "Add stop"}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* STOP FORM */}
        <StopForm formData={formData} onFormChange={setFormData} />

        {/* ACTION BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
            <Text>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={{ color: "#fff" }}>
              {existingStop ? "Save" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 20,
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
