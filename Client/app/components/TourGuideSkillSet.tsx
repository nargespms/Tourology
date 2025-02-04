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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChipSelectDropDown from "../components/ChipSelectDropDown";
import { useRegistration } from "../contexts/RegistrationContext";
import { Ionicons } from "@expo/vector-icons";

const TourGuideSkillSet: React.FC = () => {
  const navigation = useNavigation();
  const { updateData } = useRegistration();

  const languageOptions = ["English", "Spanish", "French", "German", "Italian"];
  const expertiseOptions = [
    "Historical Tours",
    "Adventure",
    "Culinary",
    "Cultural",
  ];

  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [expertiseList, setExpertiseList] = useState<string[]>(["Adventure"]);
  const [yearsOfExperience, setYearsOfExperience] = useState<string>("");

  const [languagesError, setLanguagesError] = useState("");

  /**
   * Validates that at least one language is selected.
   */
  const validateInputs = (): boolean => {
    let isValid = true;

    if (languages.length === 0) {
      setLanguagesError("At least one language is required");
      isValid = false;
    } else {
      setLanguagesError("");
    }

    return isValid;
  };

  const handleContinue = () => {
    if (!validateInputs()) return;

    updateData({
      languages,
      skills: expertiseList,
      yearsOfExperience: yearsOfExperience
        ? Number(yearsOfExperience)
        : undefined,
    });

    navigation.navigate("TourGuideCompleteProfile" as never);
  };
  const onGoBackTap = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View>
            <Image
              source={require("../../assets/choose-role.png")}
              style={styles.topImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={[styles.topButton, { left: 18 }]}
              onPress={() => onGoBackTap()}
            >
              <Text style={styles.topButtonText}>
                <Ionicons name="arrow-back" size={18} />
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Let us know your skills</Text>

            <ChipSelectDropDown
              label="Languages spoken*"
              items={languageOptions}
              selectedItems={languages}
              onSelectedItemsChange={(selected) => {
                setLanguages(selected);
                setLanguagesError("");
              }}
              placeholder="Select a language"
            />
            {languagesError ? (
              <Text style={styles.errorText}>{languagesError}</Text>
            ) : null}

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
              style={[
                styles.continueButton,
                languages.length === 0 && { opacity: 0.7 },
              ]}
              onPress={handleContinue}
              disabled={languages.length === 0}
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
      </KeyboardAvoidingView>
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  topButton: {
    position: "absolute",
    top: 20,
    zIndex: 2,
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  topButtonText: {
    color: "#393939",
    fontSize: 18,
  },
});
