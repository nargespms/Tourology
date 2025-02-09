import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRegistration } from "../contexts/RegistrationContext";

const RegisterChooseRole: React.FC = () => {
  const navigation = useNavigation();
  const { updateData, data } = useRegistration();

  const handleSelectRole = (role: "traveler" | "guide") => {
    if (role === "traveler") {
      updateData({
        role: "traveler",
      });

      navigation.navigate("TourGuideCompleteProfile" as never);
      return;
    } else if (role === "guide") {
      updateData({
        role: "guide",
      });

      navigation.navigate("TourGuideSkillSet" as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/choose-role.png")}
        resizeMode="cover"
      />
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>Welcome {data.firstName}!</Text>
        <Text style={styles.subtitle}>Are you a traveler or a tour guide?</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleSelectRole("traveler")}
          >
            <Image
              source={require("../../assets/traveler.png")}
              style={styles.roleIcon}
              resizeMode="contain"
            />
            <Text style={styles.roleText}>Traveler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleSelectRole("guide")}
          >
            <Image
              source={require("../../assets/tour-guide.png")}
              style={styles.roleIcon}
              resizeMode="contain"
            />
            <Text style={styles.roleText}>Tour Guide</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterChooseRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topImage: {
    width: "100%",
    height: 200,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleCard: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: "center",
    marginHorizontal: 4,
  },
  roleIcon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
