import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { checkIn } from "../api/tours";

interface QRCodeScannerProps {
  onScanSuccess: (scannedData: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess }) => {
  const isScanning = useRef(true);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const queyClient = useQueryClient();

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, []);

  const { mutate: doCheckIn, isPending } = useMutation({
    mutationFn: (data) => checkIn(data.tourId, data.userId),
    onSuccess: ({ attendee }) => {
      onScanSuccess(attendee);
      Alert.alert("Check-in Success", `${attendee.name} has checked in now!`);
      queyClient.invalidateQueries("activeTour");
    },
  });

  if (!permission) {
    return <Text style={styles.infoText}>Requesting Camera Permission...</Text>;
  }

  if (isPermissionGranted === false) {
    return <Text style={styles.infoText}>Camera Access Denied</Text>;
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (isScanning.current && !isPending) {
            isScanning.current = false;
            const [tourId, userId] = data.split(",");
            doCheckIn({ tourId, userId });
          }
        }}
      />

      <View style={styles.scanFrame} />
      <Text style={styles.scanText}>Align QR Code inside the frame</Text>

      {isPending && <Text style={styles.infoText}>Checking in...</Text>}
    </View>
  );
};

export default QRCodeScanner;

const styles = StyleSheet.create({
  cameraContainer: {
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    position: "absolute",
  },
  scanText: {
    position: "absolute",
    bottom: 20,
    color: "white",
    fontSize: 16,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
