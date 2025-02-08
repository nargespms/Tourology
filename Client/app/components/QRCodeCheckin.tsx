import { useQuery } from "@tanstack/react-query";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { getUserHasCheckedIn } from "../api/tours";

interface QRCodeCheckinProps {
  tourId: string;
  onCheckinSuccess: () => void;
  onClose: () => void;
}

const QRCodeCheckin: React.FC<QRCodeCheckinProps> = ({
  onCheckinSuccess,
  onClose,
  tourId,
}) => {
  const {
    isFetching,
    refetch,
    data: isCheckedIn,
  } = useQuery({
    queryKey: ["userCheckedIn", tourId],
    queryFn: () => getUserHasCheckedIn(tourId),
  });

  useEffect(() => {
    // retry the query every 2 seconds
    const interval = setInterval(() => {
      refetch();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isCheckedIn) {
      Alert.alert("Checked in successfully!");
      onCheckinSuccess();
    }
  }, [isCheckedIn]);

  return (
    <View style={styles.checkinContainer}>
      <Text style={styles.modalTitle}>Check-in</Text>
      <Text style={styles.modalSubtitle}>
        Ask your tour guide to scan the QR code to check you in.
      </Text>
      <View style={styles.qrCodeContainer}>
        <QRCode value={tourId} size={270} />
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRCodeCheckin;

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#777",
    marginBottom: 20,
  },
  checkinContainer: {
    padding: 8,
    paddingBottom: 50,
    minHeight: "60%",
  },
  qrCodeContainer: {
    margin: "auto",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
