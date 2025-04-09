import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Tourology</Text>

      <Text style={styles.subtitle}>
        Where Every Journey Becomes a Masterpiece
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => navigation.navigate("Login" as never)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate("Register" as never)}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#1F4D5C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#4285F4",
  },
  registerButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  registerButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
});
