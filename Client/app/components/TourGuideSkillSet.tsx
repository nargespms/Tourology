import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChipSelectDropDown from "../components/ChipSelectDropDown";

const TourGuideSkillSet: React.FC = () => {
  const navigation = useNavigation();

  const languageOptions = ["English", "Spanish", "French", "German", "Italian"];
  const expertiseOptions = [
    "Historical Tours",
    "Adventure",
    "Culinary",
    "Cultural",
  ];

  const [languages, setLanguages] = useState<string[]>(["English", "Spanish"]);
  const [expertiseList, setExpertiseList] = useState<string[]>(["Adventure"]);

  const [yearsOfExperience, setYearsOfExperience] = useState("");

  const handleContinue = () => {
    console.log("Languages:", languages);
    console.log("Expertise:", expertiseList);
    console.log("Years of experience:", yearsOfExperience);

    navigation.navigate("TourGuideCompleteProfile" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require("../../assets/choose-role.png")}
          style={styles.topImage}
          resizeMode="cover"
        />

        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Let us know your skills</Text>

          <ChipSelectDropDown
            label="Languages spoken"
            items={languageOptions}
            selectedItems={languages}
            onSelectedItemsChange={setLanguages}
            placeholder="Select a language"
          />

          <ChipSelectDropDown
            label="Areas of expertise"
            items={expertiseOptions}
            selectedItems={expertiseList}
            onSelectedItemsChange={setExpertiseList}
            placeholder="Select an expertise"
          />

          <Text style={styles.label}>Years of experience</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., 5"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={yearsOfExperience}
            onChangeText={setYearsOfExperience}
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TourGuideSkillSet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  topImage: {
    width: "100%",
    height: 200,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
