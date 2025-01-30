import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

interface QRCodeScannerProps {
  onScanSuccess: (scannedData: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, []);

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
          if (isScanning) {
            setIsScanning(false); // Prevent multiple scans
            onScanSuccess(data);
            Alert.alert("QR Code Scanned", `Scanned Data: ${data}`, [
              { text: "OK", onPress: () => setIsScanning(true) },
            ]);
          }
        }}
      />

      <View style={styles.scanFrame} />
      <Text style={styles.scanText}>Align QR Code inside the frame</Text>
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
